---
title: The two factories
date: 2016-02-27
categories: [ Programming ]
tags: [ OOP, DesignPattern, FactoryPattern ]
toc: false
---

Have you ever hesitated between these two implementation of the Factory Pattern:

<!--more-->

Factory #1

```java
class AnimalFactory {
    public Animal createAnimal(String type) throws Exception {
        if (type.equals("dog"))
            return new Dog();
        if (type.equals("cat"))
            return new Cat();
        throw new Exception();
    }
}
```

Factory #2

```java
class AnimalFactory {
    public Animal createDog() {
        return new Dog();
    }
    public Animal createCat() {
        return new Cat();
    }
}
```

Which one is the best?

The point of the Factory Pattern is hiding concrete/volatile stuff when creating objects, by exposing an abstract/stable interface. Indeed, both of the two factories hide the concrete types `Dog` and `Cat`, and expose the abstract type `Animal`. This is very good.

The factory #2 is more readable, but what if the interface `Animal` changes frequently? For example, when you add a new method `createElephant`, all current clients of the factory will be affected unnecessarily because they never want to create elephants. By "affected" I mean recompiled and redeployed, not "source code changed" -- indeed, those client code don't change. In such a situation, the factory #1 is better though it's less readable.

So, the choosing of the best factory depends on how likely the code changes. Just remember to keep the factory interface stable to satisfy the Dependency Inversion Principle.
