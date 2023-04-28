---
title: Some thoughts on monads
subtitle: Yet another explanation on monads in the context of functional programming
description: Yet another explanation on monads in the context of functional programming
date: 2017-11-30
categories: [ Programming ]
tags: [ FunctionalProgramming, Monad, DesignPattern ]
resources:
  - name: featured-image
    src: featured.jpg
---

I know, I know, the world does not need yet another explanation on monads. There have been a lot of related articles you can find on the Internet. Still, most of them are so math-intensive that we as software developers (we aren't good at math) don't want to read. So please give me a try to explain monads to you. I think they are worth knowing about. No math knowledge is required. What I want from you is just a basic knowledge of programming with types and functions.

## Motivation

Let's say we have a collection of functions, each receives something of some type and returns something of some type. We denote them as:

    f1: A -> B
    f2: B -> C
    f3: C -> D
    f4: D -> E

Since these functions are *type compatible* -- the output type of a function is the same with the input type of the next function -- they are easily composable. For example, we can compose `f1` and `f2` to get a new function `g` with type `A -> C`, like this:

    g = compose f1 f2

Or we can use the operator `>>`:

    g = f1 >> f2

One day, due to requirement changes, we modify the output types of some functions:

    f1: A -> M<B>
    f2: B -> M<C>
    f3: C -> M<D>
    f4: D -> E

where `M<'T>` is some variant type of `'T`, for example, `Option<'T>`, or `Async<'T>`. Roughly speaking, `M<'T>` is a "wrapper" of `'T`.

{{< admonition note >}}
The notion `'T` depicts a generic type with name `T`.
{{< /admonition >}}

This situation is very common. Initially, the requirements of our software are simple; so, for example, `f1` can return a value of type `B` directly. Later, requirements are changed, we recognize that in some cases `f1` can fail to return a value of `B` and needs to return something like `None` or `Nothing`. In this example, the type `Option<'T>` is used, the `f1` function should return a value of type `Option<B>`.

Now, the problem is that these functions are not composable anymore.

What should we do?

## The magicCompose function

Assume that we could compose `f1` and `f2` by using a `magicCompose` function, to get a function `g` of type `A -> M<C>`, like this:

    g = magicCompose f1 f2

Let's build `magicCompose` and we will see that it is not magic at all.

The `magicCompose` function receives `f1` and `f2` as input, its job is to produce a new function with type `(a: A) -> M<C>`.

Firstly, `a` is always passed to `f1`, and something `m` of type `M<B>` is returned.

Secondly, `m` is "unwrapped" to reveal something of type `B` and that something will be passed to `f2`. The result produced by `f2` is the final result (of type `M<C>`, of course). Sure, the unwrapping can be failed. In this case, it's up to `magicCompose` to determine something of type `M<C>` as the final result, and `f2` could be ignored.

The second step described above is actually over-specific, though it is the most common case. In general, at this step the `magicCompose` function can do whatever logic, use `m` and `f2` in an arbitrary way, as long as it finally produces something of type `M<C>`.

In fact, we need to make the `magicCompose` function be generic so that it can work with other functions, like `f3`, not only `f1` and `f2`. Thus, the type of the `magicCompose` function should be generic:

    magicCompose:
        ('T -> M<'U>)
          -> ('U -> M<'V>)
          -> ('T -> M<'V>)

Use it:

    magicCompose f1 f2

Or we can use the operator `>=>`:
    
    f1 >=> f2

{{< admonition tip Remember >}}
`>=>` means `magicCompose`.
{{< /admonition >}}

## The bind function

Sometimes, we don't want to do `magicCompose` on `f1` and `f2`. For example, we may call `f1` first, then receive something `m` of type `M<B>`; or all we have is just something `m` of type `M<B>`.

Then we need a function which helps passing `m` to `f2`, and finally receive a result of type `M<C>`.

This function actually does the second step of the `magicCompose` function as described above. We call it the `bind` function. The operator counterpart is `>>=`.

The type of the `bind` function:

    bind: M<'U> -> ('U -> M<'V>) -> M<'V>

Use it:

    bind (f1 a) f2
    bind m f2

Or using the operator `>>=`:

    f1 a >>= f2
    m >>= f2
 
As we can see, the `magicCompose` function is merely built on-top of the `bind` function.

{{< admonition tip Remember >}}
`>>=` means `bind`.
{{< /admonition >}}

## The unit function

How about the function `f4`? Its type is still `D -> E`, it is out of the league of functions with type `'T -> M<'U>`. Hence `f4` cannot be composed with any function of that league in a uniform way.

So we need a way to convert `f4` from type `D -> E` to type `D -> M<E>`.

That way uses a `unit` function which transforms the output of `f4` (type `E`) to something of type `M<E>`. So we can make `f4` joining the league by writing:

    f4 >> unit

Now, to compose `f3` with `f4`, we write:

    f3 >=> (f4 >> unit)

The `unit` function should be trivial / simple / stupid / straightforward / obvious. For example, if `E` is `int` and `M<E>` is `int list`, then `unit e` should return a list with only one element: `e`.

Type of the `unit` function, generic, of course:

    unit: 'T -> M<'T>

Notice that `unit` is also a member of the league of functions with type `'T -> M<'U>`.

## The map function

Sometimes, this code:

    m >>= (f4 >> unit)

can be shortened as:

    m <!> f4

The `<!>` operator is called `map` operator. In its function form, we write:

    map m f4

We can see that the `map` function is merely built on-top of the `bind` and `unit` functions:

    map m f = m >>= (f >> unit)

Type of the `map` function:

    map: M<'T> -> ('T -> 'U) -> M<'U>

{{< admonition tip Remember >}}
`<!>` means `map`.
{{< /admonition >}}

## Monad definition

Now we have the definition of a monad:

{{< admonition note What >}}
The type `M<'T>`, together with the two functions `bind` and `unit`, define a monad.
{{< /admonition >}}

and recognize its importance:

{{< admonition note Why >}}
Monads helps composing type incompatible functions.
{{< /admonition >}}

There is an interesting analogy: if the set of the `'T -> M<'U>` functions was a set of numbers, then the `magicCompose` operator would be an numeric operator like `+` `-` `*` `/`, and the `unit` function would be the _neural number_ (like `0` for `+`, or `1` for `*`).

This analogy leads to three laws of a monad.

## The three monad laws

Strictly speaking, a true monad needs to obey the three laws below:

1. Left identity: `unit >=> f = f` just like `0 + n = n` or `1 * n = n`.
2. Right identity: `f >=> unit = f` just like `n + 0 = n` or `n * 1 = n`.
3. Associativity: `f >=> (g >=> h) = (f >=> g) >=> h` just like `x + (y + z) = (x + y) + z` or `x * (y * z) = (x * y) * z`.

It is not that just because of the analogy we have these three laws. They also have practical benefits.

The practical benefit for the 3rd law is obvious: it would be very surprised for programmers when seeing `f >=> (g >=> h)` produces something different from `(f >=> g) >=> h`.

Regarding the 2nd law, consider when we want to `magicCompose` a function `f` with the *identity function*. The identity function is a function which returns output same as input, and is often denoted as `id`. Since `id` has type of `'T -> 'T`, we need to use the `unit` function in order to make `id` composable with `f`, so we write:

    f >=> (id >> unit)

In our subconscious, every function when composing with `id` will produce the same function. We want this rule to apply to `magicCompose` too. Therefore, we want to see:

    f >=> (id >> unit) = f

Obviously, `id >> unit = unit`, so what we want to see is actually the 2nd law: `f >=> unit = f`.

And the 1st law is just a consequence of the other laws.

Keep in mind these three laws when designing the `bind` and `unit` functions of a monad. Make sure they are satisfied.

## Final thought

Function composition is so important in functional programming that every functional language tries to make this comfortable as much as possible. In F#, to compose two functions with compatible types, we just use the built-in `>>` operator; to compose two functions with incompatible types, we write a monad and often name the involved operators as `>=>` for `magicCompose`, `>>=` for `bind`, and `<!>` for `map`. The core library of the language also provides some handy monads such as `Option`, `Result`, and `Async`. It even provides a killer feature called `Computation Expressions` for situations where the use of operators causes harm to code readability.

To conclude, monads are just a design pattern -- a very important pattern in functional programming -- which aids function composition.
