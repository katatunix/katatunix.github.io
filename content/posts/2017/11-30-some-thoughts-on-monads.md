---
title: Some thoughts on monads
subtitle: Yet another explanation on monads in the context of functional programming
description: Yet another explanation on monads in the context of functional programming
date: 2017-11-30
categories: [ Programming ]
tags: [ functional-programming, monad, design-pattern ]
featuredImage: /images/2017/11-30-some-thoughts-on-monads/featured.jpg
images: [ /images/2017/11-30-some-thoughts-on-monads/featured.jpg ]
---

I know, I know, the world does not need yet another explanation on monads. There have been a lot of related articles you can find on the Internet. Still, most of them are so math-intensive that we as software developers (we aren't good at math) don't want to read. So please give me a try to explain monads to you. I think they are worth knowing about. No math knowledge is required. What I want from you is just a basic knowledge of programming with types and functions.

## Motivation

Let's say we have a collection of functions, each receives something of type `A` and returns something of type `A` too. We denote them as:

    f1: A -> A
    f2: A -> A
    f3: A -> A
    f4: A -> A

Since these functions are symmetric, they are easily composable. For example, we can compose `f1` and `f2` to get a new function with the same type `A -> A`, like this:

    compose f1 f2

Or we can use the operator `>>`:

    f1 >> f2

One day, we modify `f1`, `f2`, and `f3` to type `A -> M`:

    f1: A -> M
    f2: A -> M
    f3: A -> M
    f4: A -> A

Oh man, now these three functions are not composable anymore.

## The magicCompose function

Assume that we could compose `f1` and `f2` by using a `magicCompose` function, like this:

    magicCompose f1 f2

Let's build `magicCompose` and we will see that it is not magic at all.

This function receives two functions `f1` and `f2` of type `A -> M` as input, its job is to return a new function of the same type `(a: A) -> M`.

Firstly, `a` is always passed to `f1`, and something `m` of type `M` is returned.

Secondly, `m` is "unwrapped" to reveal something of type `A` and that something will be passed to `f2`. The result produced by `f2` is the final result (of type `M`, of course). Sure, the unwrapping can be failed. In this case, it's up to `magicCompose` to determine something of type `M` as the final result, and `f2` could be ignored. A common case is that `magicCompose` will return `m` directly.

The second step described above is actually over-specific, though it is the most common situation. In general, at this step the `magicCompose` function can do whatever logic, use `m` and `f2` in an arbitrary way, as long as it finally produces something of type `M`.

The signature of the `magicCompose` function:

    magicCompose: (A -> M) -> (A -> M) -> (A -> M)
    //               f1          f2        result

Use it:

    magicCompose f1 f2

Or we can use the operator `>=>`:
    
    f1 >=> f2

>Please remember that `>=>` means `magicCompose`.

## The bind function

Sometimes, we don't want to do `magicCompose` on `f1` and `f2`. For example, we may call `f1` first, then receive something `m` of type `M`; or all we have is just something `m` of type `M`.

Then we need a function which helps passing `m` to `f2`.

This function actually does the second step of the `magicCompose` function as described above. We call it the `bind` function. The operator counterpart is `>>=`.

The signature of the `bind` function:

    bind: (A -> M) -> M -> M
    //       f2       m

Use it:

    bind f2 (f1 a)
    bind f2 m

Or using the operator `>>=`:

    f1 a >>= f2
    m >>= f2
 
As we can see, the `magicCompose` function is merely built on-top of the `bind` function.

>Please remember that `>>=` means `bind`.

## The unit function

How about the function `f4`? Its type is still `A -> A`, it is out of the league of functions with type `A -> M`. Hence `f4` cannot be composed with any function of that league in a uniform way.

So we need a way to convert `f4` from type `A -> A` to type `A -> M`.

That way uses a `unit` function which transforms the output of `f4` (type `A`) to something of type `M`. So we can make `f4` joining the league by writing:

    f4 >> unit

Now, to compose `f3` with `f4`, we write:

    f3 >=> (f4 >> unit)

The `unit` function should be trivial / simple / stupid / straightforward / obvious. For example, if `A` is `int` and `M` is `int list`, then `unit a` returns a list with only one element: `a`.

Signature of the `unit` function:

    unit: A -> M

Notice that it is also a member of the league of functions with type `A -> M`.

## The map function

Sometimes, this code:

    m >>= (f4 >> unit)

should be shortened as:

    m <!> f4

The `<!>` operator is called `map` operator. In its function form, we write:

    map f4 m

We can see that the `map` function is merely built on-top of the `bind` and `unit` functions:

    map f m = m >>= (f >> unit)

Signature of the `map` function:

    map: (A -> A) -> M -> M
    //      f4       m

>Please remember that `<!>` means `map`.

## Monad definition

Now we have the definition of a monad:

>The two types `A` and `M`, together with the `bind` and `unit` functions, define a monad.

and recognize its importance:

>Monads helps composing incompatible functions.

There is an interesting analogy: if the set of the `A -> M` functions was a set of numbers, then the `magicCompose` operator would be an numeric operator like `+` `-` `*` `/`, and the `unit` function would be the _neural number_ (like `0` for `+`, or `1` for `*`).

This analogy leads to three laws of a monad.

## The three monad laws

Strictly speaking, a true monad needs to obey the three laws below:

1. Left identity: `unit >=> f = f` just like `0 + n = n` or `1 * n = n`.
2. Right identity: `f >=> unit = f` just like `n + 0 = n` or `n * 1 = n`.
3. Associativity: `f >=> (g >=> h) = (f >=> g) >=> h` just like `x + (y + z) = (x + y) + z` or `x * (y * z) = (x * y) * z`.

It is not that just because of the analogy we have these three laws. They also have their practical benefits. So please carefully consider these laws when designing the `bind` and `unit` functions of a monad.

The 1st and 2nd laws suggest that the `unit` function is actually a "wrapping" function which does the opposite job of the "unwrapping" involved in the `bind` function. Furthermore,

* while the 1st law requires that the wrapped value `m` must always be successfully unwrapped to the original value `a`,
* the 2nd law forces that when the `bind` function fails to unwrap a value `m`, it must return `m` directly, in case the unwrapping is successful, the unwrapped value `a` must be passed to the `unit` function which in turn must wrap `a` back to the original value `m`.

The practical benefit for the 3rd law is obvious: without that law, it would be very surprised for programmers when seeing `f >=> (g >=> h)` produces something different from `(f >=> g) >=> h`.

## Final thought

Function composition is so important in functional programming that every functional language tries to make this comfortable as much as possible. In F#, to compose two functions with compatible types, we just use the built-in `>>` operator; to compose two functions with incompatible types, we write a monad and often name the involved operators as `>=>` for `magicCompose`, `>>=` for `bind`, and `<!>` for `map`. The core library of the language also provides some handy monads such as `Option`, `Result`, and `Async`. It even provides a killer feature called `Computation Expressions` for situations where the use of operators causes harm to code readability.

To conclude, monads are just a design pattern -- a very important pattern in functional programming -- which aids function composition.
