---
title: How do you use Exceptions?
date: 2016-07-16
categories: [ Programming ]
tags: [ Exception, Java, CSharp ]
toc: true
---

Exceptions are a very common concept in most of languages nowadays. In this article we will discuss why exceptions are needed, checked vs. unchecked exceptions, and why C# doesn't have checked exceptions.

## In the old days, defensive code were a mess

Before exceptions were invented, defensive code had been overwhelmed with a lot of error checking and recovery from those errors, for example:

```c
void handle() {
  // style #1: error is embedded in the return value
  int errFoo = foo();
  if (errFoo == -1) {
    // recovery and may return  
  }
  // style #2: error is assigned to the output parameter
  unsigned int errBar;  
  int value = bar(..., &errBar);
  if (errBar != 0) {
    // recovery and may return  
  }
  // do something with value
  // style #3: a separated & global function to get error
  kaka();
  int errKaka = getKakaError();
  if (errKata == 1) {
    // recovery and may return  
  }
  // the rest
}
```

The style #1 is most intuitive but it requires the return value to have a slot for storing the error. If that slot is not available, we can use the style #2 however this style may create a long list of parameters which is often annoying. The style #3 is quite common in OpenGL, OpenAL, EGL with a disadvantage is that we are very likely to forget the error checking.

No matter which style is chosen, the code is really messy because happy code and defensive code are mixed together.

## With exceptions, happy code and defensive code are separated

In a language that supports exceptions -- such as Java -- the code above could be rewritten as:

```java
public void handle() {
  try {
    foo();
    int value = bar();
    // do something with value
    kaka();
  } catch (Exception e) {
    // recovery and may return
  }
  // the rest
}
```

Isn't it much cleaner? In case the `try` block is too long, no worries, you can always extract it to another method:

```java
public void handle() {
  try {
    handleWithException();
  } catch (Exception e) {
    // recovery and may return  
  }
  // the rest
}
private void handleWithException() throws Exception {
  foo();
  int value = bar();
  // do something with value
  kaka();
}
```

Another common case is, the `handle` method would delegate the recovery job to its callers, by indicating it also throws an exception just like `foo`, `bar` and `kaka`. Now the code cannot be cleaner:

```java
public void handle() throws Exception {
  foo();
  int value = bar();
  // do something with value
  kaka();
  // the rest
}
```

You may notice that the exceptions I described above are called _checked exceptions_.

## Checked exceptions: you are forced to check

As you see, a checked exception is a part of the method signature: `public void handle() throws Exception` therefore compiler would complaint if the callers of the handle method didn't check the exception explicitly by either surrounding the call inside a `try`/`catch` block or re-throwing the exception. By this way, those callers would never forget checking the exception. It's good, right?

It's not always good. There are cases in which the callers don't want to be annoyed by the exception. They don't care whether the exception happens or not, or they are sure that the exception will never happen. If it does, just let it be implicitly bubbled up to the caller. Eventually no caller catches that exception? No problem! The program should crash immediately because e.g. it is a bug and needs to be fixed, not to be hidden. The style of such a program is named as [fail-fast](https://en.wikipedia.org/wiki/Fail-fast). And exceptions fulfilling that situation are called _unchecked exceptions_.

## Unchecked exceptions: you are not forced to check

Unchecked exceptions are flexible since the checking is not mandatory. In Java, `java.lang.RuntimeException` is the base unchecked exception; some of common derived unchecked exceptions are `NoSuchElementException` and `NumberFormatException`.

The former one is associated with the next method of an `Iterator`, but because we usually check the `hasNext` method before calling `next` so it would be very annoying if the next threw a checked exception.

The `NumberFormatException` is thrown when e.g. we convert an invalid string to a number. This is often a result of a mistake from developers, hence that `NumberFormatException` is an unchecked exception is reasonable.

## Principle: "Don't use exceptions for flow control"

You can have a read on the discussion of this principle [here](http://c2.com/cgi/wiki?DontUseExceptionsForFlowControl). Basically, since exceptions -- just like return values -- are also a way to indicate the result of a method, so you can _cheat_ by throwing an exception for a normal result. Yes, it works! But it's dirty and does cause confusing to its callers. That's why the principle.

Now let's take the principle to an extreme level. Technically speaking, whenever you catch an exception, it is flow control. In the catch block, even if you just print logs, or even do nothing, it is still flow control.

Thus, in my opinion, the principle should be rewritten as: "Don't use exceptions for returning normal results".

## Why C# doesn't have checked exceptions?

To me this was a good decision of the language created by Microsoft.

Checked exceptions have a profound problem that we might have to practice a lot to recognize it. Back to the handle method above, in reality, it's very likely that the method would delegate the recovery job to the callers because e.g. it has no enough information or simply no responsibility to do the job. So its signature changes. Immediately, all of its current callers are affected. This affection is really strong since the source code of callers must change also. Worse, those changes may be propagated to the callers of callers and so on.

Of course, without checked exceptions, the risk is that we may forget checking an exception that should have been checked. But I don't think this is a big problem, that exception should happen very soon if our system is well tested, so we can fix it easily. Moreover, if methods are well documented, we can detect an exception early even though it is not reminded by compiler.
