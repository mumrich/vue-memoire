using Build.Extensions;

using Cake.Common.Solution;
using Cake.Common.Tools.GitVersion;
using Cake.Core;
using Cake.Core.IO;
using Cake.Frosting;

namespace Build
{
  public class BuildContext : FrostingContext
  {
    public BuildContext(ICakeContext context) : base(context)
    {
      (SolutionDirectoryFullPath, SolutionFile, Solution) = context.GetSolutionInfo();
      ViteJsProjName = context.LoggedArgument(nameof(ViteJsProjName), "mumrich-vue-memoire");
      GitVersion = context.GitVersion();
    }

    public GitVersion GitVersion { get; }
    public SolutionParserResult Solution { get; }
    public string SolutionDirectoryFullPath { get; }
    public IFile SolutionFile { get; }
    public string ViteJsProjName { get; set; }
  }
}