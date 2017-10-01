# name of the active component, relevant for help page content
rk.set.comp("Data filtering")

## dialog
rkt.filter.condition <- rk.XML.input(
  label="Selection condition",
  id.name="condition"
)

rkt.filter.condition.frame <- rk.XML.frame(
  rkt.filter.condition,
  label="Filter",
  checkable=TRUE,
  chk=FALSE,
  id.name="filter_frame"
)
    
rkt.filter.dialog <- rk.XML.dialog(
  rkt.filter.condition.frame,
  label="Data filtering"
) 


## wizard
rkt.filter.wizard <- rk.XML.wizard(
  rk.XML.page(
    rk.XML.text(text="Check the box to filter the data before. You must introduce the selection condition."),
    rk.XML.copy(id="filter_frame"),
    id.name="page_filter"
  ),
  label="Data filtering"
)


## logic
rkt.filter.logic <- rk.XML.logic(
  rkt.filter.extVariable <- rk.XML.external(
    id="variable"
  )
)


## JavaScript calculate
rkt.filter.JS.VarVariable <- rk.JS.vars(rkt.filter.extVariable, getter="getString")
rkt.filter.JS.varData <- rk.JS.method("split", values="[[", suffix="[0]", object=rkt.filter.JS.VarVariable, var="data")
rkt.filter.JS.calc <- rk.paste.JS(
  rkt.filter.JS.VarVariable,
  rkt.filter.JS.varData,
  js(
    if (rkt.filter.condition.frame){
    "echo (data + \" <- subset(\" + data + \", subset=\" + condition + \")\\n\");"
#      echo (data, " <- subset(", data, ", subset=", rkt.filter.condition, ")\n")
    }
  )
)


## make a component of all parts
rkt.component.filter <- rk.plugin.component(
  about="filter_embed",
  xml=list(
    dialog=rkt.filter.dialog,
    wizard=rkt.filter.wizard,
    logic=rkt.filter.logic
  ),
  js=list(
    results.header=FALSE,
    calculate=rkt.filter.JS.calc
#     printout=rkt.filter.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy="",
  create=c("xml", "js")
)
