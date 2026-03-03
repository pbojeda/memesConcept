---
name: start-context
description: "Use this agent after restart IDE, to understand the project and the context. Also when context is restarted, use this agent to understand the project and the context."
tools: Bash, Glob, Grep, LS, Read, Edit, Write
model: sonnet
color: blue
---

analiza la documentación en "/docs" y en CLAUDE y los workflows en .agent para que entiendas cómo funciona el proyecto. 
A continuación, siguiendo nuestro sdd, quiero añadir la funcionalidad: