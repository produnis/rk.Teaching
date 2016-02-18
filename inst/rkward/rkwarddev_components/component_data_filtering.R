# name of the active component, relevant for help page content
rk.set.comp("Data filtering")


## dialog section
rkt.datafiltering.varselector.selector <- rk.XML.varselector(
  label="Select data frame or variable",
  id.name="selector"
)

rkt.datafiltering.varslot.dataframe <- rk.XML.varslot(
  label="Data frame",
  source=rkt.datafiltering.varselector.selector,
  required=TRUE,
  classes=c("data.frame"),
  id.name="dataframe"
)

rkt.datafiltering.tabbook <- rk.XML.tabbook(
  tabs=list(
    "Filter cases"=list(
      rkdev.input.condition <- rk.XML.input(
        label="Selection condition",
        id.name="condition"
      )
    )      ,
    "Filter variables"=list(
      rkdev.frame.variables_frame <- rk.XML.frame(
        rkdev.varslot.variables <- rk.XML.varslot(
          label="Select variables",
          source=rkt.datafiltering.varselector.selector,
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

rkt.datafiltering.saveobject.save <- rk.XML.saveobj(
  label="Save new data frame",
  initial="new.data.frame",
  id.name="save"
)

rkt.datafiltering.dialog <- rk.XML.dialog(
  rkt.datafiltering.row.row_vars <- rk.XML.row(
    rkt.datafiltering.varselector.selector,
    rk.XML.col(
      rkt.datafiltering.varslot.dataframe,
      rkt.datafiltering.tabbook,
      rkt.datafiltering.saveobject.save
    ),
    id.name="row_vars"
  ),
  label="Data filtering"
)


## wizard section
rkt.datafiltering.wizard <- rk.XML.wizard(
  rkt.datafiltering.page.page_dataframe <- rk.XML.page(
    rk.XML.text(
      text="Data frame selection"
    ),
    rkt.datafiltering.varselector.selector2 <- rk.XML.varselector(
      label="Select the data frame to filter",
      id.name="selector2"
    ),
    rkt.datafiltering.varslot.dataframe <- rk.XML.varslot(
      label="Data frame",
      source=rkt.datafiltering.varselector.selector2,
      required=TRUE,
      classes=c("data.frame"),
      id.name="dataframe"
    ),
    id.name="page_dataframe"
  ),
  rkt.datafiltering.page.page_condition <- rk.XML.page(
    rk.XML.text(
      text="Insert the filtering condition to select cases.

        Any logic or relational operator of R can be used in the condition expression.

        Examples: gender==&quot;female&quot;, age&gt;20, gender==&quot;female&quot; | age&gt;20."
    ),
    rkt.datafiltering.copy.condition <- rk.XML.copy(
      id=rkdev.input.condition
    ),
    id.name="page_condition"
  ),
  rkt.datafiltering.page.page_variables <- rk.XML.page(
    rk.XML.text(
      text="To select only a subset of variables, mark the checkbox and select the desired variables."
    ),
    rkt.datafiltering.copy.selector <- rk.XML.copy(
      id=rkt.datafiltering.varselector.selector
    ),
    rkt.datafiltering.copy.variables_frame <- rk.XML.copy(
      id=rkdev.frame.variables_frame
    ),
    id.name="page_variables"
  ),
  rkt.datafiltering.page.page_save <- rk.XML.page(
    rk.XML.text(
      text="Insert a name for the new data frame."
    ),
    rkt.datafiltering.copy.save <- rk.XML.copy(
      id=rkt.datafiltering.saveobject.save
    ),
    id.name="page_save"
  ),
  label="Data filtering"
)


## logic section
rk.XML.logic(
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
  ),
  rk.XML.convert(
    sources=list(available="dataframe"),
    mode=c(equals="true"),
    id.name="dataframe_sel"
  ),
  rk.XML.connect(
    governor="dataframe_sel",
    client="condition"
  ),
  rk.XML.connect(
    governor="dataframe_sel",
    client="variables_frame"
  )
)


## JavaScript calculate
rkt.datafiltering.JS.calc <- rk.paste.JS(
  rkdev.varslot.variables.shortname <- rk.JS.vars(rkdev.varslot.variables, modifiers="shortname", join=", "),
  rk.i18n.comment("Create a new dataset with the filtered data"),
  echo(".GlobalEnv$", rkt.datafiltering.saveobject.save, " <- subset(", rkt.datafiltering.varslot.dataframe, ", subset=", rkdev.input.condition),
  js(
    if(rkdev.frame.variables_frame){
      if(rkdev.varslot.variables.shortname != ""){
        echo(", select=c(", rkdev.varslot.variables.shortname, ")")
      } else {}
    } else {}
  ),
  echo(")\n"),
  rk.i18n.comment("Copy also the labels of original data set"),
  echo("for(i in 1:length(names(", rkt.datafiltering.saveobject.save, "))){\n"),
  echo("\t attr(.GlobalEnv$", rkt.datafiltering.saveobject.save, "[[names(", rkt.datafiltering.saveobject.save, ")[i]]],\".rk.meta\") = attr(", rkt.datafiltering.varslot.dataframe, "[[names(", rkt.datafiltering.saveobject.save, ")[i]]],\".rk.meta\")\n"),
  echo("}\n")
)


## JavaScript printout
rkt.datafiltering.JS.print <- rk.paste.JS(
  rk.JS.header("Data filtering",
    addFromUI=rkt.datafiltering.varslot.dataframe,
    addFromUI=rkdev.input.condition,
    addFromUI=rkdev.varslot.variables)
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
#     globals=id("var ", 
#       rkt.datafiltering.varslot.dataframe, ", ",
#       rkdev.input.condition, ", ",
#       rkdev.varslot.variables, ";"
#     ),
    calculate=rkt.datafiltering.JS.calc,
    printout=rkt.datafiltering.JS.print
  ),
  scan=c("var"),
  guess.getter=guess.getter,
  hierarchy=list("Teaching", "Data"),
  create=c("xml", "js"),
)
