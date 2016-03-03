# name of the active component, relevant for help page content
rk.set.comp("Frequency tabulation")

## dialog
rkt.tabulation.selector <- rk.XML.varselector(
            label="Select variable",
            id.name="selector"
          )

rkt.tabulation.variable <- rk.XML.varslot(
              label="Variable to tabulate",
              source="selector",
              required=TRUE,
              id.name="variable"
            )             
          
rkt.tabulation.grouped <- rk.XML.cbox(
              label="Tabulate by groups",
              un.value="0",
              id.name="grouped"
            )
            
rkt.tabulation.groups <- rk.XML.varslot(
              label="Grouping variables",
              source="selector",
              required=TRUE,
              multi=TRUE,
              types=c("factor"),
              id.name="groups"
            )            

rkt.tabulation.filter <- rk.XML.embed(
              component="cmp_KappadeCohenfilterembed",
              id.name="filter"
            )

rkt.tabulation.cells <- rk.XML.embed(
            component="rkTeaching::cells",
            id.name="cells"
          )

rkt.tabulation.intervals <- rk.XML.frame(
          rkt.tabulation.cells,
          label="Grouping intervals",
          checkable=TRUE,
          chk=FALSE,
          id.name="intervals"
        )          
          
            
rkt.tabulation.dialog <- rk.XML.dialog(
  rk.XML.tabbook(
    tabs=list(
      "Variable"=list(
        rkt.tabulation.row_vars <- rk.XML.row(
          rkt.tabulation.selector,
          rk.XML.col(
            rkt.tabulation.variable,
            rkt.tabulation.grouped,
            rkt.tabulation.groups,
            rkt.tabulation.filter
          ),
          id.name="row_vars"
        )
      )  ,
      "Classes"=list(
        rkt.tabulation.intervals
      )  
    )
  ),
  label="Frequency tabulation"
)


## wizard
rkt.tabulation.wizard <- rk.XML.wizard(
  rk.XML.page(
    rk.XML.text(text="Select the variable to tabulate."),
    rkt.tabulation.copy.selector <- rk.XML.copy(id="selector"),
    rkt.tabulation.copy.variable <- rk.XML.copy(id="variable"),
    id.name="page_vars"
  ),
  rk.XML.page(
    rk.XML.text(text="Check the box to do a previous filter of data. You must insert the selection condition."),
    rk.XML.copy(id="filter_frame"),
    id.name="page_filter"
  ),
  rk.XML.embed(
    component="rkTeaching::cells",
    id.name="cells"
  ),
  label="Frequency tabulation"
)

## logic
rkt.tabulation.logic <- rk.XML.logic(
  rk.XML.convert(
    sources=list(state="grouped"),
    mode=c(equals="1"),
    id.name="grouped_mode"
  ),
  rk.XML.connect(
    governor="grouped_mode",
    client="groups",
    set="visible",
    get=""  
  )
)


## JavaScript calculate
#rkt.recoding.variable.shortname <- rk.JS.vars(rkt.recoding.variable, modifiers="shortname")
rkt.tabulation.JS.calc <- rk.paste.JS(
#   "rules = rules.replace(/\\n/gi,'; ');",
#   "comment(\"Applying the recoding rules\");",
#   echo (".GlobalEnv$", rkt.recoding.save, " <- car::recode(", rkt.recoding.variable, ", \"", rkt.recoding.rules, "\""),
#   js(
#     if(rkt.recoding.asfactor){
#       echo (", as.factor.result=TRUE");
#     } else {
#       echo (", as.factor.result=FALSE");
#     }
#   ),
#   echo(")\n")
)

## JavaScript printout
rkt.tabulation.JS.print <- rk.paste.JS(
#   echo("rk.header(", i18n(rkt.recoding.dialog@attributes$label), ", parameters=list(", 
#   i18n(rkt.recoding.variable@attributes$label), " = rk.get.description(", rkt.recoding.variable, "),",
#   i18n(rkt.recoding.rules@attributes$label), " = \"", rkt.recoding.rules, "\",",
#   i18n("New variable"), " = rk.get.description(", rkt.recoding.save, ")",
#   "))\n")
)

## make a component of all parts
rkt.component.tabulation <- rk.plugin.component(
  about="Frequency tabulation",
  xml=list(
    dialog=rkt.tabulation.dialog,
    wizard=rkt.tabulation.wizard,
    logic=rkt.tabulation.logic
  ),
  js=list(
    require="rk.Teaching",
    results.header=FALSE
#     globals=id("var ", 
#       rkt.tabulation.variable, ", ",
#       rkt.tabulation.rules, ", ",
#       rkt.tabulation.save, "; "
#     ),
#     calculate=rkt.tabulation.JS.calc,
#     printout=rkt.tabulation.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy=list("Teaching", "Frequency distribution"),
  create=c("xml", "js")
)
