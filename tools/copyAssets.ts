import * as shell from "shelljs";

// Copy all the view templates
shell.cp("-R", "views", "build/");
shell.cp("-R", "public", "build/");
