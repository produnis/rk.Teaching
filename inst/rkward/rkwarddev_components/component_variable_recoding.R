# name of the active component, relevant for help page content
rk.set.comp("Variable recoding")

## dialog section
rkt.recoding.selector <- rk.XML.varselector(
  label="Select variable",
  id.name="selector"
)

rkt.recoding.variable <- rk.XML.varslot(
  label="Variable to recode",
  source="selector",
  required=TRUE,
  id.name="variable"
)

rkt.recoding.rules <- rk.XML.input(
  label="Recoding rules",
  size="large",
  id.name="rules"
)

rkt.recoding.save <- rk.XML.saveobj(
  label="Save new variable",
  initial="new.variable",
  id.name="save",
  checkable=FALSE
)

rkt.recoding.asfactor <- rk.XML.cbox(
  label="Convert in factor",
  un.value="0",
  chk=TRUE,
  id.name="asfactor"
)

rkt.recoding.dialog <- rk.XML.dialog(
  rkt.recoding.row_vars <- rk.XML.row(
    rkt.recoding.selector,
    rk.XML.col(
      rkt.recoding.variable,
      rkt.recoding.rules,
      rkt.recoding.save,
      rkt.recoding.asfactor
    ),
    id.name="row_vars"
  ),
  label="Variable recoding"
)


## wizard section
rkt.recoding.wizard <- rk.XML.wizard(
  rkt.recoding.page_variable <- rk.XML.page(
    rk.XML.text(text="Select the variable to recode."),
    rk.XML.copy(id="selector"),
    rk.XML.copy(id="variable"),
    id.name="page_variable"
  ),
  rkt.recoding.page_rules <- rk.XML.page(
    rk.XML.text(
      text="<p>Insert the recodification rules.</p>
      <p>Each rule must be defined in a different line with the following format:<br/>
      old value = new value</p>
      <p>The old value can be intervals with the format<br/>
      lower limit:upper limit<br/>
      and you can use the keywords \"lo\" for the minimum and \"hi\"; for the maximum value of the sample.</p>
      <p><b>Examples</b>: lo:49.9 = \"F\", 50:54.9 = \"E\", 55:59.9 = \"D\", 60:69.9 = \"C\", 70:89.9 = \"B\", 90:94.9 = \"A\", 95:100 = \"A+\""
    ),
    rk.XML.copy(id="rules"),
    id.name="page_rules"
  ),
  rkt.recoding.page_new_variable <- rk.XML.page(
    rk.XML.text(text="Inser the name for the new variable and click the button Change to select the data frame where to save it. By default the new variable is saved in .GlobalEnv."),
    rk.XML.copy(id="save"),
    id.name="page_new_variable"
  ),
  rkt.recoding.page_factor <- rk.XML.page(
    rk.XML.text(text="Check the box to convert the new variable in a factor."),
    rk.XML.copy(id="asfactor"),
    id.name="page_factor"
  ),
  label="Variable recoding"
)


## JavaScript calculate
#rkt.recoding.variable.shortname <- rk.JS.vars(rkt.recoding.variable, modifiers="shortname")
rkt.recoding.JS.calc <- rk.paste.JS(
#  rkt.recoding.variable.shortname,
  "rules = rules.replace(/\\n/gi,'; ');",
  "comment(\"Applying the recoding rules\");",
  echo (".GlobalEnv$", rkt.recoding.save, " <- car::recode(", rkt.recoding.variable, ", \"", rkt.recoding.rules, "\""),
  js(
    if(rkt.recoding.asfactor){
      echo (", as.factor.result=TRUE");
    } else {
      echo (", as.factor.result=FALSE");
    }
  ),
  echo(")\n")
)

## JavaScript printout
rkt.recoding.JS.print <- rk.paste.JS(
  echo("rk.header(", i18n(rkt.recoding.dialog@attributes$label), ", parameters=list(", 
  i18n(rkt.recoding.variable@attributes$label), " = rk.get.description(", rkt.recoding.variable, "),",
  i18n(rkt.recoding.rules@attributes$label), " = \"", rkt.recoding.rules, "\",",
  i18n("New variable"), " = rk.get.description(", rkt.recoding.save, ")",
  "))\n")
)



## make a component of all parts
rkt.component.recoding <- rk.plugin.component(
  about="Variable recoding",
  xml=list(
    dialog=rkt.recoding.dialog,
    wizard=rkt.recoding.wizard
#    logic=rkt.recoding.logic
  ),
  js=list(
    require="car",
    results.header=FALSE,
    globals=id("var ", 
      rkt.recoding.variable, ", ",
      rkt.recoding.rules, ", ",
      rkt.recoding.save, "; "
    ),
    calculate=rkt.recoding.JS.calc,
    printout=rkt.recoding.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy=list("Teaching", "Data"),
  create=c("xml", "js")
)
