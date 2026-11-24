window.addEventListener("load", function () {
  var spec = JSON.parse(document.getElementById("openapi-spec").textContent);
  window.ui = SwaggerUIBundle({
    spec: spec,
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis],
    layout: "BaseLayout",
  });
});
