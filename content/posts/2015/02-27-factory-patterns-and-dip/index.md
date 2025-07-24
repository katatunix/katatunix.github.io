---
title: Factory patterns and DIP
date: 2015-05-30
categories: [ Programming ]
tags: [ OOP, DesignPattern, FactoryPattern ]
---

Every line of code that uses the `new` keyword may violate the [Dependency Inversion Principle](http://en.wikipedia.org/wiki/Dependency_inversion_principle) (DIP). Indeed, a class after `new` must be always concrete:

```java
void test() {
    Shape obj = new Circle();
}
```

In this example, after creating `obj`, we use and treat it like a `Shape` -- an abstract class. So why does the `test()` method have to depend on `Circle` -- a concrete class? If the `Circle` class is unstable, depending on it is terrible because, e.g., when its name changes to `Kircle`, the `test()` method must changes also. We want to keep `test()` stable. What should we do?

## Static factory methods

Guys who haven't read [this book](http://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented-ebook/dp/B000SEIBB8) (like me before) and don't respect the DIP usually implement the Factory Pattern by using static methods:

```java
class Factory {
    public static Shape create(String name) {
        if (name.equals("Circle"))
            return new Circle();
        else if (name.equals("Triangle"))
            return new Triangle();
        else
            return new DummyShape();
    }
}
 
void test() {
    Shape obj = Factory.create("Circle");
}
```

This approach is seductive. It's fast. It's easy. It's natural. But please note that it still violates DIP. The static method `Factory.create()` is clearly concrete: `Factory` is not an abstract class, and `create()` is not an abstract method. In other words, this factory is still a concrete class.

## Factory Method and Abstract Factory

In the world of Gang of Four, there's no static method (except the Singleton Pattern) because they respect the DIP. Let's apply the Abstract Factory pattern to our example:

```java
interface ShapeFactory {
    Shape create(String name);
}

class ShapeFactoryImplA implements ShapeFactory {
    public Shape create(String name) {
        if (name.equals("Circle"))
            return new Circle();
        else if (name.equals("Triangle"))
            return new Triangle();
        else
            return new DummyShape();
    }
}
 
void test(ShapeFactory factory) {
    Shape obj = factory.create("Circle");
}
 
void main() {
    ShapeFactory factory = new ShapeFactoryImplA();
    test(factory);
}
```

The main idea of this pattern is that it eliminates concrete factories, as its name suggested: "Abstract Factory". We have to pass a factory object which belongs to `ShapeFactory` interface into the `test()` method. Yes, this technique is called [Dependency Injection](http://en.wikipedia.org/wiki/Dependency_injection). Now the `test()` method depends totally on abstract things. Well, it satisfies the DIP.

## You are still defending the static method?

I have to say again, the static method `Factory.create()` is quite seductive. So I'm not surprise if you are defending it. Okay, so you may say:

>In the Abstract Factory approach, somewhere still depends on concrete, aha, it's the `main()` method. Yeah, you are still depending on concrete things.

For sure, how can we execute a program that everything is abstract? Somewhere in our program must depend on concrete. But I don't care about that somewhere. Please remember, our objective is just to keep the `test()` method stable, nothing more.

And, you're still stubborn:

>If our objective is to keep the `test()` method stable, then the static method `Factory.create()` is enough. To change the logic of returning shapes, just modify source code inside the `Factory.create()` method, and the `test()` method is untouched.

Yes, you're right. However, in order to extend your factory, you have to modify its source code thus everywhere that is depending on the factory will be affected, not only the `test()` method. Clearly, this violates the [Open/Closed Principle](http://en.wikipedia.org/wiki/Open/closed_principle). With the Abstract Factory, we just create a new factory class e.g. `ShapeFactoryImplB` implementing a new logic of returning shapes. Now the `ShapeFactoryImplA` class and the `test()` method are untouched. Only the `main()` method is changed and it's obvious.

To conclude, I want to quote some thoughts from Uncle Bob:

>A strict interpretation of DIP would insist on using factories for every volatile class in the system. What’s more, the power of the FACTORY pattern is seductive. These two factors can sometimes lure developers into using factories by default. This is an extreme that I don’t recommend.
>
>Factories are a complexity that can often be avoided, especially in the early phases of an evolving design. When they are used by default, factories dramatically increase the difficulty of extending the design. In order to create a new class, one may have to create as many as four new classes: the two interface classes that represent the new class and its factory and the two concrete classes that implement those interfaces.








