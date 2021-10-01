---
title: Some thoughts on monads
subtitle: "Yet another explanation on monads on the context of functional programming."
date: 2017-11-30
categories: [ Programming ]
tags: [ functional-programming, monad, design-pattern ]
featuredImage: /images/monad.jpg
---

I know, I know, the world does not need yet another explanation on monads. There have been a lot of related articles you can find on the Internet. Still, most of them are so math-intensive that we as software developers (we aren't good at math) don't want to read. So please give me a try to explain monads to you. I think they are worth knowing about. No math knowledge is required. What I want from you is just a basic knowledge of functional programming.

## Motivation

Let's say we have a collection of functions with type `A -> A`:

    f1 : A -> A
    f2 : A -> A
    f3 : A -> A
    f4 : A -> A

Since these functions are symmetric, they are automatically composable, e.g., to compose `f1` with `f2` we just write `f1 >> f2`.

One day we modify some of them to type `A -> M`:

    f1 : A -> M
    f2 : A -> M
    f3 : A -> M
    f4 : A -> A

Oh man, now `f1`, `f2`, and `f3` are not automatically composable anymore.

## The magicCompose operator

Assume that we could compose `f1` and `f2` by using a `magicCompose` operator: `f1 magicCompose f2`, we denote the `magicCompose` as `>>=`, so we can write `f1 >>= f2`.

Let's build the `magicCompose` operator and we will see that it is not magic at all.

The operator receives two functions `f1` and `f2` of type `A -> M` as input, its job is to return a function of the same type `(a : A) -> M` which makes use of `f1` and `f2`.

Firstly,  `a` is always passed to `f1`, and something `m` of type `M` is returned.

Secondly, `m` is "unwrapped" to reveal something of type `A` and that something will be passed to `f2`. The result produced by `f2` is the final result (of type `M`, of course). Sure, the unwrapping can be failed (at run-time). In this case, it's up to `magicCompose` to determine something of type `M` as the final result, and `f2` could be ignored (not called).

The second step described above is actually over-specific, although it is the most common situation. In general, at this step the `magicCompose` operator can do whatever logic, use `m` and `f2` in an arbitrary way, as long as finally it produces something of type `M`.

The signature of the `magicCompose` operator:

    magicCompose : (A -> M) -> (A -> M) -> (A -> M)
    //                f1          f2        result

Use it:

    f1 magicCompose f2
    // or
    f1 >>= f2

## The bind function

Often, when writing code, we don't want to explicitly `magicCompose` `f1` and `f2`. We just call `f1` first, receive something of type `M`, and then pass it to an "upgraded version" of `f2`. We call this version as `f2'`, its type is of course `M -> M`.

A function that upgrades `f2` to `f2'` is called `bind` function. Its implementation is actually the second step of the `magicCompose` operator as described above.

Let's describe it again!

The `bind` function receives a function `f2` of type `A -> M`, its job is to create a new function of type `(m : M) -> M` which performs whatever logic on `m` and `f2`, as long as finally something of type `M` is returned.

The signature of the `bind` function:

    bind : (A -> M) -> (M —> M)
    //        f2          f2'

Use it:

    f1 a
    |> bind f2

## The bind operator

Still, there is a shorter syntax:

    f1 a
    >=> f2

The operator `>=>` is called `bind` operator. Its implementation is actually the body of the function returned by the `bind` function as described above.

Let's describe it again!

The `bind` operator receives something `m` of type `M` and a function `f2` of type `A -> M`, its job is to perform whatever logic on `m` and `f2` in order to return something of type `M`.

To summarize, at the core of this mechanism is the `bind` operator which glues something of type `M` to some function of type `A -> M`. The `bind` function is built on-top of the `bind` operator. And the `magicCompose` operator is built on-top of the `bind` function.

## The unit function

How about the function `f4`? Its type is still `A -> A`, it is out of the league of functions with type `A -> M`. Hence `f4` cannot be composed with any function of that league in the uniform way -- by using the `bind` function.

So we need a way to convert `f4` from type `A -> A` to type `A -> M`.

That way is called a `unit` function which transforms the output of `f4` (type `A`) to something of type `M`. If we call the new version of `f4` as `f4'` we have:

    f4' = f4 >> unit

Now, to compose `f3` with `f4` we just write:

    f3 a
    |> bind (f4 >> unit)
    // or
    f3
    >>= (f4 >> unit)

By convention, the former one is often written as:

    f3 a
    |> map f4

where `map` is a function that does a "big upgrade": it upgrades a function of type `A -> A` to a function of type `M -> M`. **`(*)`**

Here is the implementation of the `map` function -- very simple:

    let map f = bind (f >> unit)

The `unit` function should be trivial / simple / stupid / straightforward / obvious. For example, if `A` is `int` and `M` is a list of `int`, then `unit x` is a list with only one element `x` (this is actually the `unit` function of the List Monad).

Now we have the definition of a monad:

>The two types `A` and `M`, together with the `magicCompose` operator (or the `bind` function/operator) and the `unit` function, define a monad!

There is an interesting analogy: if the set of the `A -> M` functions was a set of numbers, then the `magicCompose` operator would be an numeric operator like `+` `-` `*` `/`, and the `unit` function would be the neural number (like `0` for `+` or `1` for `*`).

This analogy leads to three laws of a monad.

## The three monad laws

Strictly speaking, a monad is called a monad if it obeys the three laws below:

1. Left identity: `unit >>= f = f` just like `0 + f = f` or `1 * f = f`
2. Right identity: `f >>= unit = f` just like `f + 0 = f` or `f * 1 = 1`
3. Associativity: `f >>= (g >>= h) = (f >>= g) >>= h` just like `f + (g + h) = (f + g) + h` or `f * (g * h) = (f * g) * h`

It is not that just because of the analogy we have these three laws. They also have their practical reasons.

The practical reason for the 3rd law is obvious: without that law, it would be very surprised for programmers when seeing `f >>= (g >>= h)` produces something different from `(f >>= g) >>= h`.

Regarding the 2nd law, consider:

    f >> map id

where `id` is an identity function: it always produces output that is the same as its input.

Look into `map id` and re-read the definition of the `map` function at **`(*)`**. Logically, this expression should produce a function that is also an identity one. In other words: `map id = id`. So we have:

    f >> map id = f
    // or
    f >> bind (id >> unit) = f
    // this means
    f >> bind unit = f
    // or
    f >>= unit = f

This is exactly the 2nd law: right identity.

Finally, the 1st law is just a consequence of the 3rd and 2nd laws:

    (f >>= unit) >>= g    =    f >>= (unit >>= g)
         f       >>= g    =    f >>= (unit >>= g)
                     g    =           unit >>= g

Yes, this is exactly the 1st law: left identity.
