# Code Server

Hosts the code and a websocket to pass along highlighting info.

```mermaid
flowchart TD
    web["🌐 Web Interface"] -->|uploads code| code-server[("💾 Code Server\n(this)")]
    code-server -->|hightlight data| web
    code-server -->|downloads code| bot-server["💻 Bot Server"]
    bot-server -->|highlight data| code-server
    bot-server -->|motor instructions| robot["🤖 Robot"]
    robot -->|sensor data| bot-server
    tag-server["📷 Tag Server"] -->|apriltag positions| bot-server
    
    style code-server stroke-width:2px,stroke-dasharray: 5 5,stroke:#3b82f6
    
    click web "https://github.com/AutoSumo/web"
    click bot-server "https://github.com/AutoSumo/server"
    click robot "https://github.com/AutoSumo/robot"
    click tag-server "https://github.com/AutoSumo/tag-server"
```

https://user-images.githubusercontent.com/26680599/185769401-c024f6a5-496c-4001-9858-a5e7ccef9a41.mp4
