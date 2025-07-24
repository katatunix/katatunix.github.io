---
title: 'Null References: The Billion Dollar Mistake'
subtitle: Null is evil
description: Null is evil
date: 2016-08-03
categories: [ Programming ]
tags: [ 'Null', Exception ]
toc: false
---

`Null` is clearly evil. We as human tend to forget to check `null`, and boom... crash!!!

<!--more-->

Documentation may help, but again we still forget reading documents. Worse, not all documents are correct and up-to-date 100%. Even if we remember to do every `null` check, our code would be very messy.

So what is the solution?

Checked-exceptions can help but must be used with care otherwise nearly every function/method in our programs could throw checked-exceptions, and `try`/`catch` statements would appear everywhere.

Unchecked-exceptions basically don't solve the problem of `null`. But at least they are a bit better than `null` because they can carry descriptive messages and make programs crash exactly at exact locations (with `null` the crashes only happen when `null` is accessed afterward).

`NullObject` pattern can avoid crashing when we forget checking the returned object, but then we might forget it forever since no error is thrown at both compile-time and run-time. Moreover, in order to use `NullObject` pattern we have to change a class to an interface, sometimes such a change is not desired.

Recently, `Optional` has been emerged as a good alternative for `null`. In my opinion, this alternative still has the problem of checked-exceptions. If we aren't careful, `Optional` could be everywhere in our code. A disadvantage of `Optional` is, to achieve clean code we have to learn `Maybe` monad, `map`, `reduce`, `filter` -- these are very important concepts of Functional Programming. But when we grasp the concepts, it's really great!
