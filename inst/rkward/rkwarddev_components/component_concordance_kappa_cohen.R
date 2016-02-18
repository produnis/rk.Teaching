## used as the plugin's main component
# name of the active component, relevant for help page content
rk.set.comp("Cohen's Kappa")


## dialog section
  rkt.cohenkappa.varselector.selector <- rk.XML.varselector(
    label="Select variables",
    id.name="selector"
  )

  rkt.cohenkappa.varslot.x <- rk.XML.varslot(
    label="First measure",
    source=rkt.cohenkappa.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="x"
  )

  rkt.cohenkappa.varslot.y <- rk.XML.varslot(
    label="Second measure",
    source=rkt.cohenkappa.varselector.selector,
    required=TRUE,
    types=c("factor"),
    id.name="y"
  )


  rkt.cohenkappa.dialog <- rk.XML.dialog(
    rkt.cohenkappa.row.row_vars <- rk.XML.row(
      rkt.cohenkappa.varselector.selector,
      rk.XML.col(
        rkt.cohenkappa.varslot.x,
        rkt.cohenkappa.varslot.y
      ),
      id.name="row_vars"
    ),
    label="Cohen's Kappa concordance test"
  )


## wizard section
  rkt.cohenkappa.wizard <- rk.XML.wizard(
    rk.XML.page(
      rk.XML.text(
        text="Select the variables with the measures."
      ),
      rkt.cohenkappa.copy.row_vars <- rk.XML.copy(
        id=rkt.cohenkappa.row.row_vars
      )
    ),
    label="Cohen's Kappa concordance test"
  )


## JavaScript calculate
  rkt.cohenkappa.JS.calc <- rk.paste.JS(
    x <- rk.JS.vars(rkt.cohenkappa.varslot.x, guess.getter=guess.getter),
    id("var data = ", x, ".split('[[')[0];"),
    xShort <- rk.JS.vars(rkt.cohenkappa.varslot.x, modifiers="shortname", guess.getter=guess.getter),
    yShort <- rk.JS.vars(rkt.cohenkappa.varslot.y, modifiers="shortname", guess.getter=guess.getter),
    echo("table <- xtabs(~", xShort, "+", yShort, ", data="),
    "echo(data);",
    echo(")\n"),
    echo("results <- cohen.kappa(table)\n\n")
  )


## JavaScript printout
  rkt.cohenkappa.JS.print <- rk.paste.JS(
    rk.JS.header("Cohen's Kappa concordance test", addFromUI=rkt.cohenkappa.varslot.x, addFromUI=rkt.cohenkappa.varslot.y),
    echo ("rk.results (list("),
    echo (i18n("Kappa"), " = results$kappa"),
    echo (", ", i18n("Weigted kappa"), " = results$weighted.kappa"),
    echo ("))\n")
  )
