# name of the active component, relevant for help page content
rk.set.comp("Data filtering")


## dialog section
rkt.datafiltering.selector <- rk.XML.varselector(
  label="Select data set or variable",
  id.name="selector"
)

rkt.datafiltering.dataframe <- rk.XML.varslot(
  label="Data set to filter",
  source=rkt.datafiltering.selector,
  required=TRUE,
  classes=c("data.frame"),
  id.name="dataframe"
)

rkt.datafiltering.tabbook <- rk.XML.tabbook(
  tabs=list(
    "Filter cases"=list(
      rkt.datafiltering.condition <- rk.XML.input(
        label="Selection condition",
        id.name="condition"
      )
    )      ,
    "Filter variables"=list(
      rkt.datafiltering.variables.frame <- rk.XML.frame(
        rkt.datafiltering.variables <- rk.XML.varslot(
          label="Select variables",
          source=rkt.datafiltering.selector,
          required=TRUE,
          multi=TRUE,
          id.name="variables"
        ),
        label="Select only the following variables",
        checkable=TRUE,
        chk=FALSE,
        id.name="variables_frame"
      )
    )      
  )
)

rkt.datafiltering.save <- rk.XML.saveobj(
  label="Save new data set",
  initial="new.data.frame",
  id.name="save",
  checkable=FALSE
)

rkt.datafiltering.dialog <- rk.XML.dialog(
  rkt.datafiltering.row.row_vars <- rk.XML.row(
    rkt.datafiltering.selector,
    rk.XML.col(
      rkt.datafiltering.dataframe,
      rkt.datafiltering.tabbook,
      rkt.datafiltering.save
    ),
    id.name="row_vars"
  ),
  label="Data filtering"
)


## wizard section
rkt.datafiltering.wizard <- rk.XML.wizard(
  rk.XML.page(
    rk.XML.text(text="Select the data set to filter."),
    rkt.datafiltering.selector2 <- rk.XML.varselector(
      label="Select the data frame to filter",
      id.name="selector2"
    ),
    rk.XML.varslot(
      label="Data frame",
      source=rkt.datafiltering.selector2,
      required=TRUE,
      classes=c("data.frame"),
      id.name="dataframe"
    ),
#     rk.XML.copy(id=rkt.datafiltering.selector),
#     rk.XML.copy(id=rkt.datafiltering.dataframe),
    id.name="page_dataframe"
  ),
  rk.XML.page(
    rk.XML.text(
      text="<p>Insert the filtering condition to select cases.</p>
      <p>Any logic or relational operator of R can be used in the condition expression.</p>
      <p><b>Examples</b>: gender==\"female\", age&gt;20, gender==\"female\" & age&gt;20.</p>"
    ),
    rk.XML.copy(id=rkt.datafiltering.condition),
    id.name="page_condition"
  ),
  rk.XML.page(
    rk.XML.text(
      text="<p>To select only a subset of variables, mark the checkbox and select the desired variables.</p>"),
    rk.XML.copy(id=rkt.datafiltering.selector),
    rk.XML.copy(id=rkt.datafiltering.variables.frame),
    id.name="page_variables"
  ),
  rk.XML.page(
    rk.XML.text(text="<p>Insert a name for the new data set.</p>"
    ),
    rk.XML.copy(id=rkt.datafiltering.save),
    rk.XML.stretch(),
    id.name="page_save"
  ),
  label="Data filtering"
)


## logic section
rkt.datafiltering.logic <- rk.XML.logic(
  rk.XML.connect(
    governor="dataframe",
    client="selector",
    get="available",
    set="root"
  ),
  rk.XML.convert(
    sources=list(available="dataframe"),
    mode=c(notequals=""),
    id.name="dataframe_selected"
  ),
  rk.XML.connect(
    governor="dataframe_selected",
    client="condition",
    get=""
  ),
  rk.XML.connect(
    governor="dataframe_selected",
    client="variables_frame",
    get=""
  )
)


## JavaScript calculate
rkt.datafiltering.variables.shortname <- rk.JS.vars(rkt.datafiltering.variables, modifiers="shortname", join=", ")
rkt.datafiltering.JS.calc <- rk.paste.JS(
  rkt.datafiltering.variables.shortname,
  comment("Create a new dataset with the filtered data\n"),
  echo(".GlobalEnv$", rkt.datafiltering.save, " <- subset(", rkt.datafiltering.dataframe, ", subset=", rkt.datafiltering.condition),
  js(
    if(rkt.datafiltering.variables.frame){
      if(rkt.datafiltering.variables.shortname != ""){
        echo(", select=c(", rkt.datafiltering.variables.shortname, ")")
      } else {}
    } else {}
  ),
  echo(")\n"),
  comment("Copy also the labels of original data set\n"),
  echo("for(i in 1:length(names(", rkt.datafiltering.save, "))){\n"),
  echo("\t attr(.GlobalEnv$", rkt.datafiltering.save, "[[names(", rkt.datafiltering.save, ")[i]]],\".rk.meta\") = attr(", rkt.datafiltering.dataframe, "[[names(", rkt.datafiltering.save, ")[i]]],\".rk.meta\")\n"),
  echo("}\n"),
  var=FALSE
)


## JavaScript printout
rkt.datafiltering.JS.print <- rk.paste.JS(
  echo("rk.header(", i18n("Data filtering"), ", parameters=list(", 
  i18n(rkt.datafiltering.dataframe@attributes$label), " = \"", rkt.datafiltering.dataframe, "\""),
  js(
    if(rkt.datafiltering.condition != ""){
      echo(", ", i18n("Selection condition"), " = '", rkt.datafiltering.condition, "'")
    },
    if (rkt.datafiltering.variables.frame && rkt.datafiltering.variables != ""){
      echo(",", i18n("Selected variables"), " = '", rkt.datafiltering.variables.shortname, "'")
    }
  ),
  echo("))\n")
)


## make a component of all parts
rkt.component.datafiltering <- rk.plugin.component(
  about="Data filtering",
  xml=list(
    dialog=rkt.datafiltering.dialog,
    wizard=rkt.datafiltering.wizard,
    logic=rkt.datafiltering.logic
  ),
  js=list(
    results.header=FALSE,
    globals=list(
      rk.JS.vars(rkt.datafiltering.dataframe,
        rkt.datafiltering.condition,
        rkt.datafiltering.variables
      ),
      rk.JS.vars(rkt.datafiltering.variables.frame, modifiers="checked")
    ),
    calculate=rkt.datafiltering.JS.calc,
    printout=rkt.datafiltering.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy=list("Teaching", "Data"),
  create=c("xml", "js")
)
