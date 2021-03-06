const TARGET_PAT = /(.*):\s*(.*)/, 
      PHONY_PAT = /\.PHONY\s*:\s*(.*)/, 
      CMD_PAT = /^\t(.*)/, 
      COMMENT_PAT = /#.*/, 
      ASSIGN_PAT = /\s*(.+?)\s*=\s*(.+)/, 
      VAR_PAT = /\$\{(.*?)\}/; 
 
var fs = require('fs'),
    process = require('process'),
    eol = /\r?\n/,
    execSync = require('child_process').execSync, 
    targets,
    args,
    makeFileName = "Makefile",
    vars = {}; 
 
/**
 * Constructor function for a make target.
 * Every target has a name, a list of dependencies (that is, targets that
 * must be executed before this target), and a list of commands that must
 * be executed when the target is called.
 *
 * A phony target is invoked any time that it is called, unless it has
 * already been invoked for this call to make.  Other targets will be called
 * only when a file of the same name as the target does not exist, or if
 * the timestamp on the file is older than the timestamp of any file dependencies.
 *
 * Any command beginning with a '-' is tolerant of errors; if an error is encountered,
 * subsequent commands should still be executed.  If an error is encountered for
 * other commands, execution should terminate.
 */
function Target(name, dependencies, commands, phony) {
  this.name = name;
  this.dependencies = dependencies || [];
  this.commands = commands || [];
  this.phony = phony || false;
}
 
// Recursively call every dependency of this target, and then apply
// the commands associated with the target.  You may find it worthwhile
// to add arguments to this function -- feel free to do so.
Target.prototype.invoke = function() 
{


  //
  // ***YOUR CODE HERE***
  //
  for( var j = 0; j < this.commands.length; j++)
  {
          if (fs.existsSync(this.name))
          {
              for (var i = 0; i < this.dependencies.length; i++)
              {
                  if (fs.statSync('./' + this.name).mtime.getTime() > fs.statSync('./' + this.dependencies[i]).mtime.getTime()) {
                      console.log('jsmake: ' + "'" + this.name + "'" + ' is up to date');

                  }
              }
          }
          else
          {
              console.log(this.commands[j]); //Prints commands
              execSync(this.commands[j]);

          }

          // Executes command;
  }

    for(var i = 0; i < this.dependencies.length; i++)
    {
        for(var l = 0; l < targets.length; l++)
        {
            targets[l].invoke();

        }
    }
}
 
Target.prototype.addCommand = function(cmd)
{

  this.commands.push(cmd);

  //
  // ***YOUR CODE HERE***
  //
}



function parse(fileName) {
  var i, lines, line, cmd, first, m, deps, target, targetName,
      phonies = [],
      makeTargets = {};
  lines = fs.readFileSync(fileName).toString().split(eol);
  for (i=0; i<lines.length; i++) { 
    line = lines[i].replace(COMMENT_PAT, ''); 
    if (line.match(PHONY_PAT)) { 
      phonies = line.match(PHONY_PAT)[1].split(/\s+/); 
    } else if (line.match(ASSIGN_PAT)) { 
      m = line.match(ASSIGN_PAT);
      vars[m[1]] = m[2];
    } else if (line.match(CMD_PAT)) {
      if (!target) {
        console.error(fileName + ":" + (i+1) +
            ": *** commands commence before first target.  Stop.");
        process.exit(1); 
      }
      cmd = line.match(CMD_PAT)[1]; 
      target.addCommand(cmd); 
    } else if (line.match(TARGET_PAT)) { 
     
      if (target) makeTargets[target.name] = target; 
      m = line.match(TARGET_PAT); 
      targetName = m[1]; 
      deps = m[2].split(/\s+/);
      if (!first) first = targetName;
      target = new Target(targetName, deps); 
    }
  }
  if (target) makeTargets[target.name] = target; 
  else {
    console.error("jsmake: *** No targets.  Stop.");
    process.exit(1);
  }
  return [makeTargets, first];
}
 

args = process.argv
if (args[0].match(/\bnode/)) args.shift(); 
args.shift(); 
if (args[0] === '-f') {
  args.shift(); 
  makeFileName = args.shift();
}
 
fs.exists(makeFileName, function(exists) {
  var first, res, i, t;
  if (exists) {
    res = parse(makeFileName); 
    targets = res[0];
    first = res[1]; 
    if (args.length === 0) { 
      targets[first].invoke(); 
    } else { 
      for (i in args) { 
        t = args[i];
        if (targets.hasOwnProperty(t)) targets[t].invoke(); 
        else console.error("jsmake: *** No rule to make target `" + t + "'.  Stop.");
      }
    }
  } else {
    console.error('jsmake: *** No targets specified and no makefile found.  Stop.');
  }
});