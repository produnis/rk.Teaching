// Function that get the data frame name from variables in the form dataframe[["variable"]]
function getDataframe(vars) {
    if (Array.isArray(vars)) {
        return vars.join().toString().split('[[')[0];
    } else {
        return vars.toString().split('[[')[0];
    }
}
