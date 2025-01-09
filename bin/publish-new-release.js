const { checkCleanGitRepo, clearCache, requestProject, requestVersion, getCliArgument, hasCliArgument, publishRelease} = require("./shared");

checkCleanGitRepo();

(async function main() {

  const project = getCliArgument('--project');
  let version = getCliArgument('--version');
  const dryRun = hasCliArgument('--dry-run');

  if (version === null) {
    version = await requestVersion()
  }

  if (project) {
    try {
      await clearCache();
      await publishRelease(project, version, dryRun);
    } catch (e) {
      console.log('Error occured', e);
    }
  } else {
    console.log('Provide a project with --project');
  }

})();
