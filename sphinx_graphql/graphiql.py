import os

from docutils import nodes
from docutils.parsers.rst import Directive
from sphinx.util.fileutil import copy_asset


class SphinxGraphiQL(Directive):
    has_content = False
    required_arguments = 0
    optional_arguments = 1  # endpoint
    option_spec = {
        "height": int,
        "query": str,
        "response": str,
        "variables": str,
        "headers": str,
    }

    def run(self):
        if self.arguments:
            self.options["endpoint"] = f"{self.arguments[0].strip()}"
        else:
            self.options["endpoint"] = ""
        self.options.setdefault("height", 355)
        self.options.setdefault("variables", "")
        self.options.setdefault("headers", "")
        raw_content = (
            """
<div class="sphinx-graphiql" style="height:%(height)dpx">
    Loading GraphiQL...
    <script type="text/plain" class="query">
%(query)s
    </script>
    <script type="text/plain" class="response">
%(response)s
    </script>
    <script type="text/plain" class="variables">
%(variables)s
    </script>
    <script type="text/plain" class="headers">
%(headers)s
    </script>
    <script type="text/plain" class="endpoint">
        %(endpoint)s
    </script>
</div>
"""
            % self.options
        )
        # Copied from the docutils.parsers.rst.directives.misc.Raw directive
        raw_node = nodes.raw("", raw_content, format="html")
        (raw_node.source, raw_node.line) = self.state_machine.get_source_and_line(
            self.lineno
        )
        return [raw_node]


def setup(app):
    app.add_directive("graphiql", SphinxGraphiQL)
    app.add_css_file("https://unpkg.com/graphiql@1.8.0/graphiql.min.css")
    app.add_js_file("https://unpkg.com/react@18/umd/react.production.min.js")
    app.add_js_file("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js")
    app.add_js_file("https://unpkg.com/graphiql@1.8.0/graphiql.min.js")
    app.add_js_file("attachGraphiQL.js")
    src = os.path.join(os.path.dirname(__file__), "attachGraphiQL.js")
    dst = os.path.join(app.outdir, "_static")
    copy_asset(src, dst)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
