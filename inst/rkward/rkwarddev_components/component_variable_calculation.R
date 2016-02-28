# name of the active component, relevant for help page content
rk.set.comp("Variable calculation")


## dialog section
rkt.varcalc.varselector.selector <- rk.XML.varselector(
  label="Workspace",
  id.name="selector"
)

rkt.varcalc.varslot.dataframe <- rk.XML.varslot(
  label="Data frame",
  source=rkt.varcalc.varselector.selector,
  required=TRUE,
  classes=c("data.frame"),
  id.name="dataframe"
)

rkt.varcalc.expression <- rk.XML.input(
  label="Calculation expression",
  id.name="expression" 
)

rkt.varcalc.saveobject.save <- rk.XML.saveobj(
  label="Save new variable",
  initial="new.variable",
  id.name="save",
  chk = TRUE,
  checkable = FALSE,
  required = TRUE
)

rkt.varcalc.dialog <- rk.XML.dialog(
  rk.XML.row(
    rkt.varcalc.varselector.selector,
    rk.XML.col(
      rkt.varcalc.varslot.dataframe,
      rkt.varcalc.expression,
      rkt.varcalc.saveobject.save
    ),
    id.name="row_vars"
  ),
  label="Variable calculation"
)


## wizard section
rkt.varcalc.wizard <- rk.XML.wizard(
  rk.XML.page(
    rk.XML.text(
      text="Select the workspace that contains the variables used in the calculation"
    ),
    selector <- rk.XML.copy(
      id="selector"
    ),
    dataframe <- rk.XML.copy(
      id="dataframe"
    ),
    id.name="page_expression1"
  ),
  rk.XML.page(
    rk.XML.text(
      text="<p>Insert the expression to compute the new variable.</p>
      <p>The expression can contains any variable of the Workspace and any operator of R. Don't put an equal sign at the begining.</p>
      <p>Examples: height*100, weight/height^2.</p>"
    ),
    expression <- rk.XML.copy(
      id="expression"
    ),
    id.name="page_expression2"
  ),
  rk.XML.page(
    rk.XML.text(
      text="Inser the name for the new variable and click the button Change to select the data frame where to save it. By default the new variable is saved in .GlobalEnv."
    ),
    save <- rk.XML.copy(
      id="save"
    ),
    id.name="page_variable"
  ),
  label="Variable calculation"
)


## logic section
rkt.varcalc.logic <- rk.XML.logic(
  rk.XML.connect(
    governor="current_object",
    client="dataframe",
    set="available"
  ),
  rk.XML.connect(
    governor="dataframe",
    client="selector",
    get="available",
    set="root"
  )
)
 
## JavaScript calculate
rkt.varcalc.JS.calc <- rk.paste.JS(
  rk.i18n.comment("Create a new variable with the given expression"),
  echo(".GlobalEnv$", rkt.varcalc.saveobject.save, " <- with(", rkt.varcalc.varslot.dataframe, ", ", rkt.varcalc.expression, ")\n"),
  rk.i18n.comment("Remove the label of the new variable"),
  echo("attr(.GlobalEnv$", rkt.varcalc.saveobject.save, ",'.rk.meta') <- NULL\n")
)


## JavaScript printout
rkt.varcalc.JS.print <- rk.paste.JS(
  rk.JS.header("Variable calculation",
    addFromUI=rkt.varcalc.varslot.dataframe,
    addFromUI=rkt.varcalc.saveobject.save,
    addFromUI=rkt.varcalc.expression
  )
)


## make a component of all parts
rkt.component.variable.calculation <- rk.plugin.component(
  about="Variable calculation",
  xml=list(
    dialog=rkt.varcalc.dialog,
    wizard=rkt.varcalc.wizard,
    logic=rkt.varcalc.logic
  ),
  js=list(
    calculate=rkt.varcalc.JS.calc,
    printout=rkt.varcalc.JS.print,
    results.header=FALSE
  ),
#   rkh=list(),
  scan=c("var"),
  guess.getter=TRUE,
  hierarchy=list("Teaching", "Data"),
  create=c("xml", "js")
)
