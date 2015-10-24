# name of the active component, relevant for help page content
rk.set.comp("Coeficiente de correlación intraclase")


## dialog section
  selector <- rk.XML.varselector(
    label="Seleccionar variables",
    id.name="selector"
  )

  x <- rk.XML.varslot(
    label="Primera medida",
    source=selector,
    required=TRUE,
    types=c("factor"),
    id.name="x"
  )

  y <- rk.XML.varslot(
    label="Segunda medida",
    source=selector,
    required=TRUE,
    types=c("factor"),
    id.name="y"
  )

  dialog <- rk.XML.dialog(
    rowvars <- rk.XML.row(
      selector,
      rk.XML.col(
        x,
        y
      ),
      id.name="row_vars"
    ),
    label="Test de correlación intraclase"
  )


## wizard section
  wizard <- rk.XML.wizard(
    rk.XML.page(
      rk.XML.text(
        text="Seleccionar las variables con las medidas."
      ),
      copy.rowvars <- rk.XML.copy(
        id=rowvars
      )
    ),
    label="Test de correlación intraclase"
  )


## JavaScript calculate
  rkt.cncintr.JS.calc <- rk.paste.JS(
    xLong <- rk.JS.vars(x, guess.getter=guess.getter),
    id("var data = ", xLong, ".split('[[')[0];"),
    xShort <- rk.JS.vars(x, modifiers="shortname", guess.getter=guess.getter),
    yShort <- rk.JS.vars(y, modifiers="shortname", guess.getter=guess.getter),
    rk.i18n.comment("Código R"),
    echo("results <- ICC(as.matrix(na.omit("),
    "echo(data);",
    echo("[,c(\"", xShort, "\",\"", yShort, "\")])))\n\n")
  )


## JavaScript printout
  rkt.cncintr.JS.print <- rk.paste.JS(
    rk.JS.header("Test de correlaci&oacute;n intraclase", addFromUI=x, addFromUI=y),
    echo("rk.results (list("),
    echo(i18n("Tipo"), " = results$results$type"),
    echo(", ", i18n("ICC"), " = results$results$ICC"),
    echo(", ", i18n("Estad&iacute;stico F"), " = results$results$F"),
    echo(", ", i18n("p-valor"), " = results$results$p"),
    echo("))\n")
  )


## make a component of all parts
  rkt.component.intraclasscorr <- rk.plugin.component(
    about="Coeficiente de correlación intraclase",
    xml=list(
      dialog=dialog,
      wizard=wizard#,
  #     snippets=,
  #     logic=
    ),
    js=list(
      require="psych",
      results.header=FALSE,
  #     header.add=,
  #     variables=,
  #     globals="var x, y;",
  #     preprocess=,
      calculate=rkt.cncintr.JS.calc,
      printout=rkt.cncintr.JS.print#,
  #     doPrintout=,
  #     load.silencer=
    ),
  #   rkh=list(),
  #   provides=c("logic", "dialog"),
  #  scan=c("var", "saveobj", "settings"),
    scan=c("saveobj", "settings"),
    guess.getter=guess.getter,
    hierarchy=list("Teaching", "Concordance"),
  #   include=NULL,
    create=c("xml", "js"),
  #   dependencies=NULL,
    hints=FALSE,
  #   gen.info=TRUE,
  #   indent.by="\t"
  )
