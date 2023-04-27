---
title: How to think about MVC, MVP, PM, and MVVM?
date: 2016-03-17
categories: [ Programming ]
tags: [ OOP, DesignPattern, MVC, MVP, PM, MVVM ]
toc: true
featuredImage: main.jpg
images: [ main.jeg ]
---

This article is about my personal explanation of the famous design patterns: Model View Controller (MVC), Model View Presenter (MVP), Presentation Model (PM), and Model View ViewModel (MVVM).

Let's start with Model.

## Model: the core of an application

At the core of an application is a component called Model where _business objects_ and _use-case objects_ live. Normally, the outside world interacts with the Model by sending input to the use-case objects, these objects then manipulate the business ones and finally return output back to the outside world.

That outside world implies a new component, we name it UI -- User Interface -- or View.

## User Interface: the born of View

When we think about a View, we usually consider that it's purely about visualization. However, the fact is that we tend to put some more logics into a View. They are:

* Interaction logic: this logic defines how the controls (such as text boxes, combo boxes, buttons...) inside a View behave according to some certain rules. For example, if the text box A is empty then the button B is disabled, if the button B is clicked then the content of the text box A is chosen as input to be sent to the Model, and so on.
* The logic of input converting: the format of the input entered by users into the View might be different to the format of the input accepted by the Model. For example, consider a Model that requires an integer number as input, but what the View has is a string entered by users, in this case the View has to do the converting from string to integer.
* The logic of output converting: similarly, there are mismatches between the format of the output returned by the Model and the format that the View will use to visualize those output.

In a simple application, those three logics of a View are pretty trivial, thus directly putting them into the View is fine. But in a large application with a lot of Views and Models, chance is that we should separate some of the logics into a new component. We call this new component _man-in-the-middle_.

## Benefits of the separation

Putting some or all of the View logics into the man-in-the-middle component offers some benefits.

Firstly, the View would be more cohesive and thus can be reused in various contexts. For instance, a View would be able to work with many different Models if it doesn’t have any knowledge about the input/output format of any Model.

Secondly, the View logics, of course, would be reusable and therefore testable. If those logics are embedded in the View, unit testing for them would be very difficult.

_Depending on one, or two, or three of the View logics are assigned to the man-in-the-middle component, we will have either MVC, or MVP, or PM pattern._

## MVC: Controller is an input converter

{{< figure src="mvc.png" title="MVC: Controller is an input converter" >}}

As depicted in the figure above, in this pattern, only the logic of input converting is assigned to the man-in-the-middle component -- named as Controller. The Controller, after converting the input sent from the View, will send the formatted version to the Model. But then, how are output returned from the Model? Because the Controller doesn't do the output converting, it's better to let this component be unaware of the output. So, the Model should not return the output as Return Values (i.e. using the `return` keyword) to the Controller. Instead, the Model will send the output to the View, through an interface -- this interface is called _Use Case Output Port_ -- so the Model will not know about the View (the Model definitely must not know about anything outside it). Of course, when the View receives the output, it has to do the output converting by itself.


Notice that, the initial View and the final View are not necessarily the same. They might be two different Views, as illustrated in the figure below:

{{< figure src="mvc2.png" title="MVC with two different Views" >}}

This case is rare but it's worth to be aware. Actually, in the classic definition of MVC, the initial View is not mentioned, only the final one is. Nevertheless, I find that mention of the initial View would make easier to understand the pattern.

{{< admonition type=note title="Input converting note" >}}
There is a detail of input converting: sometimes the converting fails due to invalid input, thus an _input validation_ is implied when converting. If a failure happens, the Controller will -- without any intervention of the Model -- directly notify output (e.g. an error message) to the View or the Presenter in case of MVCP. But this validation should cover the converting only. I've seen people involving business logics -- which inherently belong to the Model -- when validating input in the Controller. This would scatter business logics across the Model and the Controller, and therefore, in my opinion, should be restricted.
{{< /admonition >}}

MVC pattern still leaves the logic of output converting in the View. If we don't like this, we could adopt the MVP pattern.

## MVP: Presenter is a Controller plus an output converter

{{< figure src="mvp.png" title="MVP: Presenter is a Controller plus an output converter" >}}

As the figure above depicts, both of the two converting logics are now assigned to the man-in-the-middle component. In this manner, the component looks like someone who presents already formatted data to the View, so it could be named as Presenter.

It is not really clear that MVP facilitates unit testing better than MVC does:

* On one hand, the testing of the output converting in MVP is possible because that logic is not embedded in the View anymore. Moreover, MVC forces that every Model must return output through Output Ports, this always requires mocking when writing unit tests for the Model. In MVP, the output of Model can be Return Values, thus mocking is not mandatory.
* On the other hand, since the Presenter has more than one responsibility, writing unit testing for it would be more difficult.

As we can see, a Presenter includes the logic of input converting plus the logic of output converting. Do we feel it is bulky? If the answer is yes, we may want to consider the MVCP pattern.

## MVCP: why not both Controller and Presenter?

Nothing special to this pattern except that it extracts a Controller from a bulky Presenter. The Presenter is really a pure Presenter as it doesn't do the logic of a Controller anymore.

MVCP pattern is not mine (but the name might be), it was introduced by Uncle Bob in his workshop [Architecture -- The Lost Years](http://confreaks.tv/videos/rubymidwest2011-keynote-architecture-the-lost-years):

{{< figure src="mvcp.jpg" title="Uncle Bob in his workshop Architecture - The Lost Years" >}}

In the diagram, the Interactor is actually the Model (or use-case object), the upper Boundary interface is the Use Case Input Port, the lower one is the Use Case Output Port. See the workshop or read [this article](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) of Uncle Bob for more information.

## PM: Presenter holds all the "model" states of the View in order to perform all View logics

Observant readers would guess that [PM pattern](https://martinfowler.com/eaaDev/PresentationModel.html) -- credit to Martin Fowler -- is an extreme pattern where _all_ the View logics -- converting and interaction -- are performed by the man-in-the-middle component -- which is still called Presenter. But unlike converting logics, interaction logic requires the Presenter to hold all the model states of the View. What are the model states of a View?

Even a simple View contains a lot of states: text colors, font sizes, font styles... such kind of states is merely for visualization and is not concerned by the View logics. But states like the content of the text box A, the status checked/unchecked of the check box B... are very important and indeed must be accessed and manipulated by the View logics. These states are called _model states_.

Obviously, the model states of a View belong to that View and thus are held by that View. So, by saying "Presenter holds all the model states of the View" we mean that the Presenter holds a copy of all the model states of the View. This requires a synchronization mechanism: every change of the model states in the View must be notified to the Presenter, and vice-versa. We can see this in the figure below:

{{< figure src="pm.png" title="PM: Presenter holds all the model states of the View in order to perform all View logics" >}}

Now the View does not need to decide -- as before -- which model states that will be chosen and sent as input to the Presenter. Such logic -- and every logic -- is handled by the Presenter.

## MVVM: PM with a mark-up View and a data binding framework

The View in the PM pattern is really pure, since it doesn't contain any logic. This turns out to be a good chance to implement the View in a language that does not fully support logics and hence is more friendly to non-programmer people like UI/UX designers. A good example of such a language is a mark-up one like XML.

But implementing the View in a different language to the Presenter also means that the synchronization of the model states between the two components is nearly impossible without a framework (or platform/library) that understands both of the two components. Such a framework is called _data binding_ where the data synchronization is performed in an implicit manner. The job of developers is just configuring which properties of this component will be synced to which properties of that component.

So, yes, MVVM pattern is essentially PM pattern with a mark-up or GUI-code View and a data binding framework. Notice that, those things are implementation details, thus, from the architectural view, there is no really difference between PM and MVVM.

## Judgement: MVC vs. MVP vs. MVCP vs. PM vs. MVVM

Deciding whether to use which pattern is quite a hard trade-off. It depends on how we distribute and balance tasks to our components. If a Controller is fat, it should not become a Presenter in MVP. If a View is complex, it should not take the logic of output converting as in MVC. If a Presenter is big, it should be separated as in MVCP. If a View is really needed to be pure, PM is the good choice. However, after all, the evaluation of fat/complex/big/pure is really an art and subtle. Because of this difficulty, sometimes our decision is mainly driven by our habit.

To adopt MVVM, obviously, our framework must support (1) a mark-up language or GUI-code for View development, and (2) a data binding mechanism. In many cases, such a framework is so attractive that it dominates all of the other patterns.

## Conclusion

All the design patterns discussed in this article are usually applied in large software which involve the participation of UI. Although these patterns differ slightly -- MVC moves the logic of input converting from the View to the Controller, MVP moves both of the input and output converting to the Presenter, PM promotes the Presenter to handle the interaction logic also, and MVVM is basically PM with some useful features of some framework -- all of them are for only one purpose: [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns). The Controller/Presenter/ViewModel only concerns the logics of the View, the Model only handles the logics of business, and the View only concerns about visualization. Separation of concerns, in my opinion, is the most valuable principle of software design.
