---
title: My favorites F# JSON options
date: 2025-08-02
categories: [ Programming ]
tags: [ FSharp, JSON ]
toc: true
---

This post describe my favorites F# JSON options.

<!--more-->

## Install nuget packages

```shell
dotnet add package FSharp.SystemTextJson
```

## The options

```fsharp
open System.Text.Json.Serialization
let options =
    JsonFSharpOptions.Default()
        .WithSkippableOptionFields(SkippableOptionFields.Always, deserializeNullAsNone = true)
        .WithAllowNullFields()
        .WithUnionExternalTag()
        .WithUnionUnwrapSingleFieldCases()
        .WithUnionUnwrapFieldlessTags()
        .ToJsonSerializerOptions()

open System.Text.Json
let serialize x = JsonSerializer.Serialize(x, options)
let deserialize (str: string) = JsonSerializer.Deserialize(str, options)
```

## Explanation

- `WithSkippableOptionFields(SkippableOptionFields.Always, deserializeNullAsNone = true)` --- Omitted fields or `null` fields will be deserialized as `None`. `None` value will be serialized as omitted.
- `WithAllowNullFields()` --- Without this option, deserializing `null` value will throw exception unless its type is `Option`. With this option, if value of a field is `null` then:
    - If its type is nullable (string, class...), it will be deserialized as `null`.
    - Otherwise, throw exception.
- `WithUnionExternalTag()` --- Encode unions as a 1-valued object: The field name is the union tag, and the value is the union fields.
- `WithUnionUnwrapSingleFieldCases()` --- If set, the field of a single-field union case is encoded as just the value rather than a single-value array or object.
- `WithUnionUnwrapFieldlessTags()` --- If set, union cases that don't have fields are encoded as a bare string.

More [here](https://github.com/Tarmil/FSharp.SystemTextJson/blob/master/docs/Customizing.md).
