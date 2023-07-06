# Alltum CLI

"alltum-cli" is an internal tool developed for the Alltum project, designed to automate the processes involved in developing features and fixing bugs, and to speed up the development process.

The tool provides a set of commands that help speed up the development process and make it more efficient. With "alltum-cli", programmers can automate tasks that they commonly do while developing features and fixing bugs in the Alltum project.

## Installation

Installing "alltum-cli" is easy and straightforward. Follow these steps:

1. Clone the repository from the Alltum CLI project GitHub page.
2. Run `npm install` to install all required dependencies.
3. Run `npm link` to link the tool to your local environment.

## Commands

"alltum-cli" provides the following commands:

### `alltum work [taskId]`

The `alltum work [taskId]` command moves the task with the provided ID to the in-progress state on the board, creates and checks out the appropriate branch in the Git repository, and assigns the task to the user using the tool.

### `alltum work end`

The `alltum work end` command moves the task to review and creates a pull request for the current branch.

### `alltum init`

The `alltum init` command prompts the user for Github and Clickup tokens for configuration purposes.

## Contributing

We welcome contributions to "alltum-cli". If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes, test them, and commit your changes.
4. Push your changes to your fork.
5. Create a pull request to the Alltum project repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Feedback

I appreciate any feedback you have on the tool. Please let me know if you have any comments or suggestions. Your feedback helps me improve the tool and make it better.
