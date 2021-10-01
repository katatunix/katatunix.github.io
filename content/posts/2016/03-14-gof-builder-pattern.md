---
title: GoF Builder Pattern
subtitle: My personal explanation for Gang of Four's Builder Pattern
date: 2016-03-14
categories: [ Programming ]
tags: [ gang-of-four, design-pattern, builder-pattern ]
toc: false
featuredImage: /images/2016/03-14-gof-builder-pattern/featured.png
images: [ /images/2016/03-14-gof-builder-pattern/featured.png ]
---

Builder Pattern and Factory Pattern are pretty similar in a way: both of them encapsulate the details of object-creation processes. However, in cases there are many complicated processes to create various representations of objects, and those processes share a common trait, Builder Pattern is the better choice.

Let's say we have two processes to build a house: Asian process and European one. We will start with Factory Pattern and gradually adapt it to Builder Pattern. A possible implementation of Factory Pattern could be:

```java
class HouseFactory {
    public House createAsianHouse() {
        House h = new House();
        // build basement
        h.set...();
        ...
        // build roof
        h.set...();
        ...
        // build interior
        h.set...();
        ...
        return h;
    }
     
    public House createEuropeanHouse() {
        House h = new House();
        // build basement
        h.set...();
        ...
        // build roof
        h.set...();
        ...
        // build interior
        h.set...();
        ...
        return h;
    }
}
 
void main() {
    HouseFactory fac = new HouseFactory();
    House asianHouse = fac.createAsianHouse();
    House europeanHouse = fac.createEuropeanHouse();
}
```

The two processes might be very complicated but they always have the same manner: build basement, then build roof, and then build interior. Thus, there is a subtle duplication in the code above. Clearly, it's hard to maintain the code with duplication. For example, removing the build interior step from every process will require modifying code in two places. The same annoyance for adding back the step into every process.

Of course, we love DRY (Don't Repeat Yourself) principle! We want to eliminate the duplication! How?

Let's discard the code above and come up with a more general method, like this:

```java
class X {
    public House buildHouse() {
        buildBasement();
        buildRoof();
        buildInterior();
        return getResult();
    }
}
```

It looks good. But the method must provide an option for building either an Asian house or an European house. So we will add a parameter called `option` to the method:

```java
class X {
    public House buildHouse(option) {
        // what should we do with option and
        // the four calls below?
        buildBasement();
        buildRoof();
        buildInterior();
        return getResult();
    }
}
```

The two questions in the code above must be answered in order to give the method an ability of calling alternative versions of the four calls, depending on whether the passed `option` is about Asian or European. Here is the answer:

```java
class X {
    public House buildHouse(Y option) {
        option.buildBasement();
        option.buildRoof();
        option.buildInterior();
         
        return option.getResult();
    }
}
```

So, the boy `option` is an object that directly builds a house, he can be either an Asian builder or an European builder. From the viewpoint of the girl `X`, she doesn't care where the builder comes from, she just needs to know he is a builder and she can ask him to work. Hence, the type `Y` should be an interface named `Builder`, and the type `X` could be named as `Director`:

```java
interface Builder {
    void buildBasement();
    void buildRoof();
    void buildInterior();
    House getResult();
}
 
class Director {
    public House buildHouse(Builder builder) {
        builder.buildBasement();
        builder.buildRoof();
        builder.buildInterior();
         
        return builder.getResult();
    }
}
```

Now we implement the concrete jobs of Asian and European builders:

```java
class AsianBuilder implements Builder {
    private House h;
    public AsianBuilder() {
        h = new House();
    }
    public void buildBasement() {
        h.set...();
        ...
    }
    public void buildRoof() {
        h.set...();
        ...
    }
    public void buildInterior() {
        h.set...();
        ...
    }
    public House getResult() {
        return h;
    }
}
 
class EuropeanBuilder implements Builder {...}
```

And finally take them together into the `main` method:

```java
void main() {
    Director dir = new Director();
    House asianHouse = dir.buildHouse(new AsianBuilder());
    House europeanHouse = dir.buildHouse(new EuropeanBuilder());
}
```
