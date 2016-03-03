# name of the active component, relevant for help page content
rk.set.comp("Data filtering")

## dialog

rkt.filter.condition <- rk.XML.input(
      label="Selection condition",
      id.name="condition"
    )

rkt.filter.dialog <- rk.XML.dialog(
  rk.XML.frame(
    rkt.filter.condition,
    label="Filter",
    checkable=TRUE,
    chk=FALSE,
    id.name="filter_frame"
  ),
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
  rk.XML.external(
    id="variable"
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
    results.header=FALSE
#     globals=id("var ", 
#       rkt.filter.variable, ", ",
#       rkt.filter.rules, ", ",
#       rkt.filter.save, "; "
#     ),
#     calculate=rkt.filter.JS.calc,
#     printout=rkt.filter.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy="",
  create=c("xml", "js")
)
