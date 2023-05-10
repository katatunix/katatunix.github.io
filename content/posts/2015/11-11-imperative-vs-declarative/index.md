---
title: Imperative vs. Declarative
date: 2015-11-11
categories: [ Programming ]
tags: [ Imperative, Declarative ]
toc: false
resources:
  - name: featured-image
    src: main.jpg
---

Wikipedia defines imperative and declarative programming as:

> [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) is a style that uses statements that change a program’s state... focuses on describing HOW a program operates.
>
> [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) is a style that expresses the logic of a computation without describing its control flow... focuses on describing WHAT the program should accomplish in terms of the problem domain.

When we read the definition of something, we tend to focus on terms that are already familiar to us, and then use those terms as a metaphor in order to understand the definition. Here in this case, we should think that, for short, imperative programming is about HOW whereas declarative one is about WHAT. Of course, those definitions are correct, but somehow confused and thus difficult to understand. How can we write a program without describing HOW? Finally, the computer must do the job and it must know exactly HOW to do. It turns out that the WHAT here is still a little of HOW, but in a different way.

So every time I hear someone saying "imperative is HOW and declarative is WHAT", I feel disappoint. Rather, I like to hear: "imperative code describes control flow whereas declarative code does not". But what is control flow?

Again, Wikipedia defines [control flow](https://en.wikipedia.org/wiki/Control_flow) correctly and clearly:

> control flow is the order in which INDIVIDUAL statements, instructions or function calls are executed

The word INDIVIDUAL is important. Let's look into a typical control flow code:

    doThis;
    doThat;
    if (thisIsTrue) doThis;
    else doThat;
    while (thisIsTrue) {
        doThis;
        doThat;
    }

The code contains multiple INDIVIDUAL steps -- statements, instructions, function calls -- which are DISCRETE and separated by the semicolons. Because these steps are DISCRETE, each of them must change program's state in order to contribute to the whole program; otherwise, that step is meaningless. And using assignments is the most popular way to change program's state. The `doThis`, `doThat` in the code above can be one of following statements:

    int x = 0;
    x = 1;
    x++;
    x += 2;
    x = x + 3;
    x = foo();
    bar();

As you can see, every statement without assignments (or their variants) is meaningless. Event the call to the `void` function `bar()` still changes program's state since there must be at least one assignment inside `bar()`.

Yes, this is imperative programming where assignments and semicolons are dominant.

Declarative programming, on the other hands, does not have assignments, and hence does not need semicolons to separate steps, since there is no any step, no state change, no side-effect. In declarative world, everything is declared by its definition. To achieve a task, we have to specify and define its outcome (yeah, it is WHAT). For example, to check whether an integer number is prime, we need a definition and sub-definitions if needed:

* A prime number N is an integer number that is greater than 1, and does not have any divisor from 2 to N-1.
* A number N that does not have any divisor from 2 to N-1 is... well, we need recursion. Let's see the code :)

Translating to code:

    isPrime(N) =
        N > 1 && noDivisor(2, N)
    
    noDivisor(from, N) =
        from >= N OR (N % from != 0 AND noDivisor(from + 1, N))

Writing declarative code requires a very different thinking. The most challenge of converting imperative code into declarative one is eliminating loops because only loops really need state change. Indeed, without state change, the break conditions of loops will never be met, and loops that aggregate something are not possible.

In many cases, if a loop is about going through a list to collect something, most declarative languages provide some built-in features such as `map`, `reduce`, `filter`, `find` with lambda expressions that are quite useful and succinct, since the HOW -- how to go through the list -- is left up to the language's implementation. But in general cases, the only way to remove loops, of course, is recursion. Unfortunately, not every language is optimized for recursion.

I could not say, imperative vs. declarative, which one is better. However, in my observation, declarative code is usually more elegant and really well suited for parallel programming.
