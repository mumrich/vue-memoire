using Cake.Common;
using Cake.Core.IO;
using Cake.Frosting;
using Cake.Yarn;

namespace Build.Tasks
{
  [TaskName("Default")]
  public class DefaultTask : FrostingTask<BuildContext>
  {
    public override void Run(BuildContext context)
    {
      var viteJsProjDir = context.FileSystem
        .GetDirectory(context.SolutionDirectoryFullPath)
        .Path.Combine(context.ViteJsProjName);

      context.StartAndReturnProcess("yarn", new ProcessSettings
      {
        WorkingDirectory = viteJsProjDir,
        Arguments = "config set version-git-tag false"
      });
      context.StartAndReturnProcess("yarn", new ProcessSettings
      {
        WorkingDirectory = viteJsProjDir,
        Arguments = "config set version-tag-prefix \"\""
      });

      var yarnRunner = context.Yarn().FromPath(viteJsProjDir);

      yarnRunner.Install();
      yarnRunner.RunScript("build");
      yarnRunner.Pack();
      context.Yarn().Publish(settings =>
      {
        settings.WorkingDirectory = viteJsProjDir;
        settings.NewVersion(context.GitVersion.Major, context.GitVersion.Minor, context.GitVersion.Patch);
        settings.Tag("latest");
      });
    }
  }
}