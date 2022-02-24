---
id: data-synchronizer
title: Data Synchronizer
sidebar_label: Data Synchronizer
slug: /keadex-mina/data-synchronizer
displayed_sidebar: keadexMinaSidebar
---

# Data Synchronizer

## Component Diagram
![Example banner](/keadex-mina/diagrams/comp-diagram-data-sync.png)

## Dynamic Diagram

## Flows

### a) Database sync on files changes

| # | Description |
| :--: | :--- |
| 1.*x*a,<br/>2.*x*a | When files containing diagrams' data (specifications, stored entities) change, the **DB Synchronizer** is triggered in order to synchronize data in each related database table.

### b) Deletion of a diagram

| # | Description |
| :--: | :--- |
| 1.*x*a,<br/>2.*x*a | When files containing diagrams' data (specifications, stored entities) change, the **DB Synchronizer** is triggered in order to synchronize data in the local database.

## Notes
  - If a diagram is removed, all the `diagram.spec.json` which reference it, will be updated.