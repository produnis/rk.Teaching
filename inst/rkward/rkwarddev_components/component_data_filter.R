# name of the active component, relevant for help page content
rk.set.comp("Filtrar datos")


## dialog section
  rkt.datfltr.varselector.selector <- rk.XML.varselector(
    label="Seleccionar conjunto de datos o variables",
    id.name="selector"
  )

  rkt.datfltr.varslot.dataframe <- rk.XML.varslot(
    label="Conjunto de datos",
    source=rkt.datfltr.varselector.selector,
    required=TRUE,
    classes=c("data.frame"),
    id.name="dataframe"
  )

  rkt.datfltr.tabbook <- rk.XML.tabbook(
    tabs=list(
      "Filtrar casos"=list(
        rkdev.input.condition <- rk.XML.input(
          label="Condición de selección",
          id.name="condition"
        )
      )      ,
      "Filtrar variables"=list(
        rkdev.frame.variables_frame <- rk.XML.frame(
          rkdev.varslot.variables <- rk.XML.varslot(
            label="Seleccionar variables",
            source=rkt.datfltr.varselector.selector,
            required=TRUE,
            multi=TRUE,
            id.name="variables"
          ),
          label="Seleccionar sólo las siguientes variables",
          checkable=TRUE,
          chk=FALSE,
          id.name="variables_frame"
        )
      )      
    )
  )

  rkt.datfltr.saveobject.save <- rk.XML.saveobj(
    label="Guardar nuevo conjunto de datos",
    initial="datos.nuevos",
    id.name="save"
  )

  rkt.datfltr.dialog <- rk.XML.dialog(
    rkt.datfltr.row.row_vars <- rk.XML.row(
      rkt.datfltr.varselector.selector,
      rk.XML.col(
        rkt.datfltr.varslot.dataframe,
        rkt.datfltr.tabbook,
        rkt.datfltr.saveobject.save
      ),
      id.name="row_vars"
    ),
    label="Filtrado de Datos"
  )


## wizard section
  rkt.datfltr.wizard <- rk.XML.wizard(
    rkt.datfltr.page.page_dataframe <- rk.XML.page(
      rk.XML.text(
        text="Selecionar el conjunto de datos a filtrar"
      ),
      rkt.datfltr.varselector.selector2 <- rk.XML.varselector(
        label="Seleccionar conjunto de datos",
        id.name="selector2"
      ),
      rkt.datfltr.varslot.dataframe <- rk.XML.varslot(
        label="Conjunto de datos",
        source=rkt.datfltr.varselector.selector2,
        required=TRUE,
        classes=c("data.frame"),
        id.name="dataframe"
      ),
      id.name="page_dataframe"
    ),
    rkt.datfltr.page.page_condition <- rk.XML.page(
      rk.XML.text(
        text="Selecionar la condición para filtrar los casos.

          Puede usarse cualquier operador relacional o lógico de R.

          Ejemplos: sexo==&quot;mujer&quot;, edad&gt;20, sexo==&quot;mujer&quot; | edad&gt;0."
      ),
      rkt.datfltr.copy.condition <- rk.XML.copy(
        id=rkdev.input.condition
      ),
      id.name="page_condition"
    ),
    rkt.datfltr.page.page_variables <- rk.XML.page(
      rk.XML.text(
        text="Si se desea sólo un subconjunto de las variables, activar la casilla de selección de variables y seleccionar las variables deseadas."
      ),
      rkt.datfltr.copy.selector <- rk.XML.copy(
        id=rkt.datfltr.varselector.selector
      ),
      rkt.datfltr.copy.variables_frame <- rk.XML.copy(
        id=rkdev.frame.variables_frame
      ),
      id.name="page_variables"
    ),
    rkt.datfltr.page.page_save <- rk.XML.page(
      rk.XML.text(
        text="Introducir un nombre para el nuevo conjunto de datos."
      ),
      rkt.datfltr.copy.save <- rk.XML.copy(
        id=rkt.datfltr.saveobject.save
      ),
      id.name="page_save"
    ),
    label="Filtrado de Datos"
  )


## logic section
  rkt.datfltr.logic <- rk.XML.logic(
    rk.XML.connect(
      governor="current_object",
      client=rkt.datfltr.varslot.dataframe,
      set="available"
    ),
    rk.XML.connect(
      governor=rkt.datfltr.varslot.dataframe,
      client=rkt.datfltr.varselector.selector,
      get="available",
      set="root"
    )#,
    ## the plugin contains
    ##   <convert id="dataframe_sel" sources="dataframe.available" mode="notequals" />
    ## but it's missing a "standard" to compare against? commenting this out for the moment
#     rkt.datfltr.convert.dataframe_sel <- rk.XML.convert(
#       sources=list(available=rkt.datfltr.varslot.dataframe),
#       mode="notequals",
#       id.name="dataframe_sel"
#     ),
#     rk.XML.connect(
#       governor=rkt.datfltr.convert.dataframe_sel,
#       client=rkdev.input.condition
#     ),
#     rk.XML.connect(
#       governor=rkt.datfltr.convert.dataframe_sel,
#       client=rkdev.frame.variables_frame
#     )
  )


# dummy object to see if frame is checked
rkdev.frame.variables_frame.checked <- rk.JS.vars(rkdev.frame.variables_frame, modifiers="checked")

## JavaScript calculate
  rkt.datfltr.JS.calc <- rk.paste.JS(
    rkdev.varslot.variables.shortname <- rk.JS.vars(rkdev.varslot.variables, modifiers="shortname", join=", "),
    rk.i18n.comment("Create a new dataset with the filtered data"),
    echo(".GlobalEnv$", rkt.datfltr.saveobject.save, " <- subset(", rkt.datfltr.varslot.dataframe, ", subset=", rkdev.input.condition),
    ite(id(rkdev.frame.variables_frame.checked),
      rk.paste.JS(
        rkdev.varslot.variables.shortname,
        ite(id(rkdev.varslot.variables.shortname, " != ''"),
          echo(", select=c(", rkdev.varslot.variables.shortname, ")")
        ),
        level=3
      )
    ),
    echo(")\n"),
    rk.i18n.comment("Copy also the labels of original data set"),
    echo("for(i in 1:length(names(", rkt.datfltr.saveobject.save, "))){\n"),
    echo("\t attr(.GlobalEnv$", rkt.datfltr.saveobject.save, "[[names(", rkt.datfltr.saveobject.save, ")[i]]],\".rk.meta\") = attr(", rkt.datfltr.varslot.dataframe, "[[names(", rkt.datfltr.saveobject.save, ")[i]]],\".rk.meta\")\n"),
    echo("}\n")
  )


## JavaScript printout
  rkt.datfltr.JS.print <- rk.paste.JS(
    rk.JS.header("Filtrado de datos",
      addFromUI=rkt.datfltr.varslot.dataframe,
      addFromUI=rkdev.input.condition,
      addFromUI=rkdev.varslot.variables)
  )


## make a component of all parts
  rkt.component.data.filter <- rk.plugin.component(
    about="Filtrar datos",
    xml=list(
      dialog=rkt.datfltr.dialog,
      wizard=rkt.datfltr.wizard,
  #     snippets=,
      logic=rkt.datfltr.logic
    ),
    js=list(
  #     require=,
      results.header=FALSE,
  #     header.add=,
  #     variables=,
      globals=id("var ", 
        rkt.datfltr.varslot.dataframe, ", ",
        rkdev.input.condition, ", ",
        rkdev.varslot.variables, ";"
      ),
  #     preprocess=rkt.datfltr.JS.pre,
      calculate=rkt.datfltr.JS.calc,
      printout=rkt.datfltr.JS.print#,
  #     doPrintout=,
  #     load.silencer=
    ),
  #   rkh=list(),
  #   provides=c("logic", "dialog"),
    scan=c("var", "saveobj", "settings"),
    guess.getter=guess.getter,
    hierarchy=list("Teaching", "Data"),
  #   include=NULL,
    create=c("xml", "js"),
  #   dependencies=NULL,
    hints=FALSE,
  #   gen.info=TRUE,
  #   indent.by="\t"
  )
