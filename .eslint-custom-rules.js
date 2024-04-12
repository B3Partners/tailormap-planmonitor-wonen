function getInvalidImportsRule(projectName, allowOpenLayers, allowAdmin) {
  const rule = {
    // node packages
    paths: ["assert", "buffer", "child_process", "cluster", "crypto", "dgram", "dns", "domain", "events", "freelist", "fs", "http", "https", "module", "net", "os", "path", "punycode", "querystring", "readline", "repl", "smalloc", "stream", "string_decoder", "sys", "timers", "tls", "tracing", "tty", "url", "util", "vm", "zlib"],
    patterns: [
      // do not allow circular references to own project
      {
        "group": [projectName],
        "message": "Invalid reference to own project"
      },
      {
        "group": ["@angular/localize/init"],
        "message": "Do not import $localize. This is provided by Angular and imported once in polyfills.ts"
      }
    ]
  };
  return rule;
}

module.exports = {
  getInvalidImportsRule: getInvalidImportsRule
};
