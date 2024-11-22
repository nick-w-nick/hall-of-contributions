# Hall of Contributions
A collection of GitHub-themed widgets for displaying your love for open source in your GitHub profile README.

# Usage
- Pick the widget you like from the list below
- Paste it in your GitHub profile README.md
- Update the username in the URL to your GitHub username
- Commit the change and see the widget in action on your profile!

# Widgets
## Pull Request Activity Feed
This widget shows a list of your most recent open-source pull requests.

### Preview
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=nick-w-nick&pullRequestIndex=0)

### Usage
```md
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=YOUR_USERNAME)
```

To allow each pull request to have a hyperlink attached to them, you need to render each of them individually, which gives you control over how many pull requests you want to display in your feed.

To render each pull request individually, you can use the `pullRequestIndex` parameter to specify the index of the pull request you want to display:

```md
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=YOUR_USERNAME&pullRequestIndex=0)
```

Simply increment the value to show the next pull request in your feed. For example, to show the three most recent pull requests:

```md
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=YOUR_USERNAME&pullRequestIndex=0)
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=YOUR_USERNAME&pullRequestIndex=1)
![](https://hall-of-contributions.vercel.app/api/widgets/pull-request-card?username=YOUR_USERNAME&pullRequestIndex=2)
```