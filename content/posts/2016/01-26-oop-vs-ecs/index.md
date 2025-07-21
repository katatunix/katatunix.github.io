---
title: OOP vs. ECS
subtitle: My personal explanation and justification for ECS
description: My personal explanation and justification for ECS
date: 2016-01-26
categories: [ Programming ]
tags: [ OOP, ProceduralProgramming, ECS, GameDevelopment ]
---

In recent years, Entity-Component System (ECS) has been recognized as the most notable architecture for game development. There are many good articles about the architecture that can be found on the Internet, some of them are:

* [Entity Systems are the future of MMOG development](http://t-machine.org/index.php/2007/09/03/entity-systems-are-the-future-of-mmog-development-part-1/)
* [What is an entity system framework for game development?](http://www.richardlord.net/blog/what-is-an-entity-framework)
* [Why use an entity system framework for game development?](http://www.richardlord.net/blog/why-use-an-entity-framework)
* [Understanding Component-Entity-Systems](http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013)
* [gamedev.stackexchange.com](http://gamedev.stackexchange.com/a/31491)
* [Entity Systems Wiki](http://entity-systems.wikidot.com/)
* [Entity component system](https://en.wikipedia.org/wiki/Entity_component_system)

Of course these articles are excellent and well-written, but one thing I don't like about them is that they are not fair at comparing OOP and ECS. They think that class inheritance is fundamental to OOP thus they blame OOP in order to praise ECS as a preference of *composition over inheritance*.

I'm not going to say that ECS is not deserved for that praising. Indeed, the articles pointed many undoubted benefits of the trendy architecture. What I want to express is that OOP vs. ECS is not about *Inheritance vs. Composition*; rather, it is about *Object-Oriented Paradigm vs. Clever Procedural Paradigm*.

The rest of this article is my personal explanation and justification for ECS.

## Situation

We start with a situation:

>Decomposing a game world which contains multiple game entities into parts. Each part can be either a data structure, or a function, or an object.

Immediately, because we are object thinkers, we would consider each game entity as an object containing both data and functions. However now we are facing some problems. In the following section, we will discuss these problems and propose solutions in order to reach the ECS architecture.

## Problem 1

*An entity might have many aspects, and aspects can be reused for various kinds of entities.*

Examples of aspects include Position, Renderable, Movable... Each aspect may concern in certain data of the entity. As you can see there are cases in which the same data are concerned by multiple aspects, but this is the story of the problem 3.

### Solution

* Inheritance: bad, of course, because of its inflexibility.
* Composition: good, an entity is a composition of its aspects so-called components.

With composition, we can easily create a new entity class that has whatever aspects we want, for example:

```java
class Mario {
    public Mario(Position p, Renderable r, Movable m) {...}
    // Mario may have behaviors that merely
    // delegate to p/r/m:
    public void render() { r.render(); }
    public void move() { m.move(); }
    // or may have its own specific behaviors that
    // will never be reused for other entity classes
    public void fire() {...}
}
Position p = new Position(100, 200);
Renderable r = new Renderable(p);
Movable m = new Movable(p);
Mario mario = new Mario(p, r, m);
```

## Problem 2

*The aspects of an entity might change at run-time.*

Currently, for each entity kind, we have a concrete class for it (e.g. the `Mario` class above). So its aspects (e.g., `Position`, `Renderable`, `Movable`) are fixed at run-time. We cannot hide a `Mario` by removing the `Renderable` aspect from it when the game is running.

### Solution

* Only one class for every entity kind: `Entity` class.
* `Entity` should not know about the concrete classes of its components. Rather, `Entity` simply holds references to all of its components in which each component is declared as belonging to an abstract type: `Component` class.
* This extreme design requires every entity doesn't have its specific behaviors anymore (e.g., the `fire` behavior of `Mario`). All the behaviors must be extracted to components. An entity is merely a bag of components, nothing more.

To be honest, the two problems above are not caused by OOP. Indeed, our proposed solutions so far haven't broken any principle of OOP. However, consider the following important problems.

## Problem 3

*Components tend to heavily access data of one another.*

Clearly, many components could not stand alone. For instance, in the code above, the `Renderable` and `Movable` components need to access and modify the data of the `Position` component in order to render and move the entity correctly.

The heavily accessing of data between objects is actually a very bad practice in OOP. Unfortunately, it is nearly un-avoided in game development.

## Problem 4

*There are global behaviors.*

Very often, in game development, we have behaviors that cannot belong to any entity. Collision detection is a clear example. To detect collisions, someone global needs to access `Position` of all entities. And that someone then notifies collision info to collided entities so that those entities could respond.

Both the last two problems have one root cause: we are respecting encapsulation too much.

> In programming languages, encapsulation is used to refer to one of two related but distinct notions, and sometimes to the combination thereof:
>
> 1. A language mechanism for restricting access to some of the object's components.
> 2. A language construct that facilitates the bundling of data with the methods (or other functions) operating on that data.  
>
> --- [Wikipedia](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming))

In problem 3, because each component has it own behaviors bundled with its internal data, when these behaviors involve external data, they must talk with other components through *getters* and *setters*.

In problem 4, no way to get rid of it, except that we break encapsulation. Global behaviors always require components to expose their internal data via getters and setters. This means that accessing to objects' internal data is not restricted. As a result, components are not objects -- in their true definition -- anymore.

So, if we accept breaking encapsulation with a lot of getters and setters, why do we still let components have it own behaviors bundled with its internal data? We should continue to break encapsulation by totally separating functions from data. All functions now are global and centralized in one place.

### Solution

* Separate functions from data. Components contain data only. A function has a global access over components. It might interest on certain component classes and manipulate instances of those classes. Functions now are called *systems* or *processors*.

## Procedural is bad?

We have achieved ECS architecture. But you may say:

>This is Procedural Paradigm (PP)! It's bad!

Yes, but which are bad things about PP?

>Well, PP tends to create more dependencies between parts because PP has two kinds of dependencies: functions depend on data, and functions depend on functions. Remember, OOP, with encapsulation, has only one kind -- the last one.

Don't worry! In ECS, systems don't depend systems.

>Hmm, but, PP is terrible because in reality data structures are usually changed, and this leads to changes of all dependent functions.

Don't worry! In an ECS architecture, because of the clear organization, when a component structure is changed, we know that it will lead to changes in the systems only, and it is not too difficult to find out and fix those changes in the related systems. One could argue that in game development, data structures are more stable than functions.

## Final note

That's why I call ECS architecture Clever Procedural Paradigm. In fact, when data and functions are separated, and data is more stable than functions, we can name the architecture as Data Oriented, or even Relational Data Oriented in some particular implementation.
