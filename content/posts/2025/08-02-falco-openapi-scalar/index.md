---
title: Falco + OpenAPI + Scalar
date: 2025-08-02
categories: [ Programming ]
tags: [ FSharp, AspNet, Falco, OpenAPI, Scalar ]
toc: true
---

This post describes an ASP.NET 9.0 project template using F#, Falco, Falco.OpenApi, and Scalar.

<!--more-->

## Create an empty ASP.NET web project

```shell
dotnet new web -lang F# -o MyApp
```

## Install nuget packages

```shell
cd MyApp
dotnet add package Falco
dotnet add package Falco.OpenApi
dotnet add package Scalar.AspNetCore
```

## Program.fs

```fsharp
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open Microsoft.OpenApi.Models
open Falco
open Falco.Routing
open Falco.OpenApi
open Scalar.AspNetCore

[<EntryPoint>]
let main args =
    let builder = WebApplication.CreateBuilder(args)
    let appName = builder.Environment.ApplicationName
    let version = "v0.0.1"

    builder.Services
        .AddOpenApi(version, fun o ->
            o.AddDocumentTransformer(
                Func<OpenApiDocument, _, _, System.Threading.Tasks.Task>(
                    fun doc _ _ -> task {
                        doc.Servers[0] <- OpenApiServer(Url = "/")
                        doc.Info <- OpenApiInfo(Title = title, Version = version, Description = description)
                    }
                )
            )
            |> ignore
        )
        .AddFalcoOpenApi()
    |> ignore

    let app = builder.Build()

    app.MapOpenApi().CacheOutput() |> ignore

    app.MapScalarApiReference("/docs", fun o ->
        o.AddDocument(version).WithTitle(appName) |> ignore
    ) |> ignore

    let endpoints = [
        get "/ping" (Response.ofPlainText "Hello World")
            |> OpenApi.tags [ "Main" ]
            |> OpenApi.summary "Ping"
            |> OpenApi.description "Just ping"
            |> OpenApi.returnType typeof<string>
    ]

    app.UseRouting()
        .UseFalco(endpoints)
        .Run(Response.withStatusCode 404 >> Response.ofPlainText "Not found")

    0
```

## Result

Run the project and find the Scalar page at `{baseUrl}/docs`.
