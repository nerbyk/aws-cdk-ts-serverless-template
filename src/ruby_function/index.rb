def handler(event)
  {
    statusCode: 200,
    body: {
      text: "Hello World",
      event: event
    }
  }
end
