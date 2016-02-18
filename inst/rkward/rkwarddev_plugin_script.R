## Author: Alfredo Sánchez Alberca (asalber@ceu.es)

require(rkwarddev)
rkwarddev.required("0.08-1")

rk.local({
# set the output directory to overwrite the actual plugin
output.dir <- tempdir()
# overwrite an existing plugin in output.dir?
overwrite <- TRUE
guess.getter <- TRUE
rk.set.indent(by="  ")
rk.set.empty.e(TRUE)
update.translations <- TRUE

## you must first setwd() to $YOURSOURCES/rk.Teaching/inst/rkward for this to run properly
rkt.components.root <- normalizePath("rkwarddev_components")


about.plugin <- rk.XML.about(
  name="rk.Teaching", author=c(
    person(given="Alfredo", family="Sánchez Alberca", email="asalber@ceu.es", role=c("aut", "cre")),
    person(given="Meik", family="Michalke", email="meik.michalke@hhu.de", role=c("ctb"))
  ),
  about=list(
    desc="A RKWard plugin with basic utilities for teaching statistics",
    version="0.01-0",
    license="GPL (>= 3)",
    long.desc="RKWard GUI that introduces some utilities for teaching Statistic. This plugin is specially designed for using in introductory courses of Statistic."
  )
)

plugin.dependencies <- rk.XML.dependencies(
  dependencies=list(rkward.min="0.6.1", R.min="3.0.0"),
  package=list(
    c(name="stats"),
    c(name="utils"),
    c(name="graphics"),
    c(name="grDevices"),
    c(name="ggplot2"),
    c(name="plyr"),
    c(name="psych"),
    c(name="R2HTML"),
    c(name="car"),
    c(name="e1071"),
    c(name="Hmisc"),
    c(name="ez"),
    c(name="prob")
  )
)

## Components
source(file.path(rkt.components.root, "component_concordance_kappa_cohen.R"), local=TRUE)
# source(file.path(rkt.components.root, "component_concordance_intraclass_correlation_coefficient.R"), local=TRUE)
source(file.path(rkt.components.root, "component_variable_calculation.R"), local=TRUE)
source(file.path(rkt.components.root, "component_data_filtering.R"), local=TRUE)


#############
## the main call
## if you run the following function call, files will be written to output.dir!
#############
# this is where things get serious, that is, here all of the above is put together into one plugin
plugin.dir <- rk.plugin.skeleton(
  about=about.plugin,
  dependencies=plugin.dependencies,
  path=output.dir,
  provides=c("dialog","wizard"),
  guess.getter=guess.getter,
  xml=list(
    dialog=rkt.cohenkappa.dialog,
    wizard=rkt.cohenkappa.wizard
  ),
  js=list(
    calculate=rkt.cohenkappa.JS.calc,
    printout=rkt.cohenkappa.JS.print
  ),
  create=c("pmap", "xml", "js", "desc"),
  overwrite=overwrite,
  components=list(
#     rkt.component.intraclasscorr,
     rkt.component.variable.calculation,
     rkt.component.datafiltering
  ),
  pluginmap=list(name="Kappa de Cohen", hierarchy=list("Teaching","Concordance")),
  tests=FALSE,
  edit=FALSE, 
  load=TRUE, 
  show=FALSE,
  gen.info="$SRC/inst/rkward/rkwarddev_plugin_script.R"
)
  if(isTRUE(update.translations)){
    rk.updatePluginMessages(file.path(output.dir,"rk.Teaching","inst","rkward","rk.Teaching.pluginmap"))
  } else {}
})
