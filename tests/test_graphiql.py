from io import StringIO

import pytest
from sphinx.testing.util import SphinxTestApp


@pytest.mark.sphinx("html", testroot="graphiql")
def test_build_with_static_graphiql(
    app: SphinxTestApp, status: StringIO, warning: StringIO
) -> None:
    app.warningiserror = True
    app.builder.build_all()


@pytest.mark.sphinx("html", testroot="graphiql-live")
def test_build_with_live_graphiql(
    app: SphinxTestApp, status: StringIO, warning: StringIO
) -> None:
    app.warningiserror = True
    app.builder.build_all()
