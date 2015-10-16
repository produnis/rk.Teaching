local({
## Prepare
require(rkwarddev)
rkwarddev.required("0.06-5")

# define where the plugin should write its files
output.dir <- tempdir()
# overwrite an existing plugin in output.dir?
overwrite <- TRUE
# if you set guess.getters to TRUE, the resulting code will need RKWard >= 0.6.0
guess.getter <- TRUE

rkt.script.root <- file.path("~","daten","R","rkward_plugins","git","rk.Teaching","inst","rkward")
rkt.components.root <- file.path(rkt.script.root,"rkwarddev_components")

## Compute
about.plugin <- rk.XML.about(
  name="rk.teaching.main", author=c(
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

############
## your plugin dialog and JavaScript should be put here
############

source(file.path(rkt.components.root, "component_concordance_kappa_cohen.R"), local=TRUE)
source(file.path(rkt.components.root, "component_concordance_intraclass_correlation_coefficient.R"), local=TRUE)
source(file.path(rkt.components.root, "component_data_filter.R"), local=TRUE)

#############
## the main call
## if you run the following function call, files will be written to output.dir!
#############
# this is where things get serious, that is, here all of the above is put together into one plugin
plugin.dir <- rk.plugin.skeleton(
  about=about.plugin,
  dependencies=plugin.dependencies,
  path=output.dir,
  guess.getter=guess.getter,
#  scan=c("var", "saveobj", "settings"),
  scan=c("saveobj", "settings"),
  xml=list(
    dialog=rkt.cnckppc.dialog,
    wizard=rkt.cnckppc.wizard#,
#     snippets=,
#     logic=
  ),
  js=list(
    require="psych",
    results.header=FALSE,
#     header.add=,
#     variables=,
#    globals="var x, y;",
#     preprocess=,
    calculate=rkt.cnckppc.JS.calc,
    printout=rkt.cnckppc.JS.print#,
#     doPrintout=,
#     load.silencer=
  ),
  rkh=list(
    #summary=,
    #usage=,
    #sections=,
    #settings=,
    #related=,
    #technical=
  ),
  create=c("pmap", "xml", "js", "desc"),
  overwrite=overwrite,
  components=list(
    rkt.component.intraclasscorr,
    rkt.component.data.filter
  ),
  #provides=c("logic", "dialog"), 
  pluginmap=list(
    name="Kappa de Cohen",
    hierarchy=list("Teaching", "Concordance")
  ), 
  tests=FALSE, 
  edit=FALSE, 
  load=TRUE, 
  show=FALSE
)

})
