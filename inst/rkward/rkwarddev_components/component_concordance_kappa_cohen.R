## used as the plugin's main component
# name of the active component, relevant for help page content
rk.set.comp("Kappa de Cohen")


## dialog section
  rkt.cnckppc.varselector.selector <- rk.XML.varselector(
    label="Seleccionar variables",
    id.name="selector"
  )

  rkt.cnckppc.varslot.x <- rk.XML.varslot(
    label="Primera medida",
    source=rkt.cnckppc.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="x"
  )

  rkt.cnckppc.varslot.y <- rk.XML.varslot(
    label="Segunda medida",
    source=rkt.cnckppc.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="y"
  )


  rkt.cnckppc.dialog <- rk.XML.dialog(
    rkt.cnckppc.row.row_vars <- rk.XML.row(
      rkt.cnckppc.varselector.selector,
      rk.XML.col(
        rkt.cnckppc.varslot.x,
        rkt.cnckppc.varslot.y
      ),
      id.name="row_vars"
    ),
    label="Test de concordancia Kappa de Cohen"
  )


## wizard section
  rkt.cnckppc.wizard <- rk.XML.wizard(
    rk.XML.page(
      rk.XML.text(
        text="Seleccionar las variables con las medidas."
      ),
      rkt.cnckppc.copy.row_vars <- rk.XML.copy(
        id=rkt.cnckppc.row.row_vars
      )
    ),
    label="Test de concordancia Kappa de Cohen"
  )


## JavaScript calculate
  rkt.cnckppc.JS.calc <- rk.paste.JS(
    x <- rk.JS.vars(rkt.cnckppc.varslot.x, guess.getter=guess.getter),
    id("var data = ", x, ".split('[[')[0];"),
    xShort <- rk.JS.vars(rkt.cnckppc.varslot.x, modifiers="shortname", guess.getter=guess.getter),
    yShort <- rk.JS.vars(rkt.cnckppc.varslot.y, modifiers="shortname", guess.getter=guess.getter),
    rk.i18n.comment("Código R"),
    echo("table <- xtabs(~", xShort, "+", yShort, ", data="),
    "echo(data);",
    echo(")\n"),
    echo("results <- cohen.kappa(table)\n\n")
  )


## JavaScript printout
  rkt.cnckppc.JS.print <- rk.paste.JS(
    rk.JS.header("Test de concordancia Kappa de Cohen", addFromUI=rkt.cnckppc.varslot.x, addFromUI=rkt.cnckppc.varslot.y),
    echo ("rk.results (list("),
    echo (i18n("Kappa"), " = results$kappa"),
    echo (", ", i18n("Kappa ponderado"), " = results$weighted.kappa"),
    echo ("))\n")
  )
