import * as vscode from 'vscode';

export interface TestTaskDefinition extends vscode.TaskDefinition {
    /**
     * The task name.
     */
    task: string;
}

export class TestTaskProvider implements vscode.TaskProvider {

    provideTasks(_token: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        return getTestTasks();
    }

    resolveTask(task: vscode.Task, _token: vscode.CancellationToken): vscode.Task | undefined {
        return task;
    }
}

export function getTestTasks(): Promise<vscode.Task[]> {
    const tasks: vscode.Task[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        workspaceFolders.forEach(element => {
            tasks.push(getTestTask(element));
            tasks.push(getBuildTask(element));        
        });
    }

    tasks.push(getRebuildTask());
    tasks.push(getCleanTask());
    tasks.push(getNoneTask());
    tasks.push(getCleanTaskGlobal());
    tasks.push(getNoneTaskGlobal());
    return Promise.resolve(tasks);
}

function getTestTask(workspaceFolder: vscode.WorkspaceFolder): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-test-folder' }, workspaceFolder, 'vince-test-folder', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - Test"`));
    task.presentationOptions.reveal = vscode.TaskRevealKind.Always;
    task.presentationOptions.focus = true;
    task.presentationOptions.echo = false;
    task.presentationOptions.showReuseMessage = false;
    task.presentationOptions.panel = vscode.TaskPanelKind.Shared;
    task.presentationOptions.clear = true;

    task.group = vscode.TaskGroup.Test;
    return task;
}

function getBuildTask(workspaceFolder: vscode.WorkspaceFolder): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-build-folder' }, workspaceFolder, 'vince-build-folder', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - Build"`));
    task.group = vscode.TaskGroup.Build;
    return task;
}

function getRebuildTask(): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-rebuild-workspace' }, vscode.TaskScope.Workspace, 'vince-rebuild', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - Rebuild"`));
    task.group = vscode.TaskGroup.Rebuild;
    return task;
}

function getCleanTask(): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-clean-workspace' }, vscode.TaskScope.Workspace, 'vince-clean', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - Clean"`));
    task.group = vscode.TaskGroup.Clean;
    return task;
}

function getNoneTask(): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-none-workspace' }, vscode.TaskScope.Workspace, 'vince-none', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - None"`));
    return task;
}

function getCleanTaskGlobal(): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-clean-global' }, vscode.TaskScope.Global, 'vince-clean-global', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - Clean Global"`));
    task.group = vscode.TaskGroup.Clean;
    return task;
}

function getNoneTaskGlobal(): vscode.Task {
    const task = new vscode.Task({ type: 'vince', task: 'vince-none-global' }, vscode.TaskScope.Global, 'vince-none-global', 'vince', new vscode.ShellExecution(`sleep 5; echo "Hello World - None Global"`));
    return task;
}
