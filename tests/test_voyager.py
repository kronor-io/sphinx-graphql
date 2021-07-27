from io import StringIO

import pytest
from sphinx.testing.util import SphinxTestApp


@pytest.mark.sphinx("html", testroot="voyager")
def test_build(app: SphinxTestApp, status: StringIO, warning: StringIO) -> None:
    app.warningiserror = True
    app.builder.build_all()
