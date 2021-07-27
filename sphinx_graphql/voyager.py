import os

from docutils import nodes
from docutils.parsers.rst import Directive
from sphinx.util.fileutil import copy_asset


class SphinxVoyager(Directive):
    has_content = False
    required_arguments = 0
    optional_arguments = 1  # schema
    option_spec = {"endpoint": str}

    def run(self):
        endpoint = self.options["endpoint"]

        raw_content = f"""
<div id="voyager" class="voyager">
    Loading GraphQL Voyager...
    <script>
        FETCH_URL="{endpoint}"
        attachVoyager()
    </script>
</div>
"""

        # Copied from the docutils.parsers.rst.directives.misc.Raw directive
        raw_node = nodes.raw("", raw_content, format="html")
        (raw_node.source, raw_node.line) = self.state_machine.get_source_and_line(
            self.lineno
        )
        return [raw_node]


def setup(app):
    app.add_directive("graphql-voyager", SphinxVoyager)
    app.add_css_file("https://cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.css")
    app.add_js_file("https://cdn.jsdelivr.net/npm/react@16/umd/react.production.min.js")
    app.add_js_file(
        "https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.production.min.js"
    )
    app.add_js_file("https://cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.min.js")
    app.add_js_file("attachVoyager.js")
    src = os.path.join(os.path.dirname(__file__), "attachVoyager.js")
    dst = os.path.join(app.outdir, "_static")
    copy_asset(src, dst)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
