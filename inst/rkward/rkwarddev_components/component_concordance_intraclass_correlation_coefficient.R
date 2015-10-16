# name of the active component, relevant for help page content
rk.set.comp("Coeficiente de correlación intraclase")


## dialog section
  rkt.cncintr.varselector.selector <- rk.XML.varselector(
    label="Seleccionar variables",
    id.name="selector"
  )

  rkt.cncintr.varslot.x <- rk.XML.varslot(
    label="Primera medida",
    source=rkt.cncintr.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="x"
  )

  rkt.cncintr.varslot.y <- rk.XML.varslot(
    label="Segunda medida",
    source=rkt.cncintr.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="y"
  )

  rkt.cncintr.dialog <- rk.XML.dialog(
    rkt.cncintr.row_vars <- rk.XML.row(
      rkt.cncintr.varselector.selector,
      rk.XML.col(
        rkt.cncintr.varslot.x,
        rkt.cncintr.varslot.y
      ),
      id.name="row_vars"
    ),
    label="Test de correlación intraclase"
  )


## wizard section
  rkt.cncintr.wizard <- rk.XML.wizard(
    rk.XML.page(
      rk.XML.text(
        text="Seleccionar las variables con las medidas."
      ),
      rkt.cncintr.copy.row_vars <- rk.XML.copy(
        id=rkt.cncintr.row_vars
      )
    ),
    label="Test de correlación intraclase"
  )


## JavaScript calculate
  rkt.cncintr.JS.calc <- rk.paste.JS(
    x <- rk.JS.vars(rkt.cncintr.varslot.x, guess.getter=guess.getter),
    id("var data = ", x, ".split('[[')[0];"),
    xShort <- rk.JS.vars(rkt.cncintr.varslot.x, modifiers="shortname", guess.getter=guess.getter),
    yShort <- rk.JS.vars(rkt.cncintr.varslot.y, modifiers="shortname", guess.getter=guess.getter),
    rk.i18n.comment("Código R"),
    echo("results <- ICC(as.matrix(na.omit("),
    "echo(data);",
    echo("[,c(\"", xShort, "\",\"", yShort, "\")])))\n\n")
  )


## JavaScript printout
  rkt.cncintr.JS.print <- rk.paste.JS(
    rk.JS.header("Test de correlaci&oacute;n intraclase", addFromUI=rkt.cncintr.varslot.x, addFromUI=rkt.cncintr.varslot.y),
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
      dialog=rkt.cncintr.dialog,
      wizard=rkt.cncintr.wizard#,
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
