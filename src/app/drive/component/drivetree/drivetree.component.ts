import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TREE_ACTIONS,TreeNode } from "angular-tree-component";
import { Router } from "@angular/router";
import { FoldertreeService } from '../../services/foldertree.service';
import { MatDialog } from "@angular/material";
import { CreateFolderDialogComponent } from "../../../shared/element/create-folder-dialog/create-folder-dialog.component";
import { ProcessLoaderDialogComponent } from "../../../shared/element/process-loader-dialog/process-loader-dialog.component";
@Component({
  selector: "app-drivetree",
  templateUrl: "./drivetree.component.html",
  styleUrls: ["./drivetree.component.scss"]
})
export class DrivetreeComponent implements OnInit {
  nodes = [
    {
      name: "/",
      hasChildren: true,
      id: 0
    }
  ];

  options = {
    getChildren: (node: TreeNode) => {
      return this.foldertreeService
        .foldrertree(node.id)
        .then(result => {
          console.log(result.data);
          return result.data;
        })
        .catch(error => {
          console.log(error);
          return [];
        });
    }
  };
  constructor(
    private foldertreeService: FoldertreeService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {}

  contextMenuOpen($event, menutrigger) {
    $event.preventDefault();
    menutrigger.openMenu();
  }

  navigate($event, node) {
    $event.preventDefault();
    this.router.navigate(["/drive", node.id]);
  }

  isExpand($event, isexpand) {
    $event.preventDefault();
    isexpand ? TREE_ACTIONS.COLLAPSE : TREE_ACTIONS.EXPAND;
  }

  createFolder(node, foldertree) {
    let dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: "250px",
      data: { name: "" }
    });

    dialogRef.afterClosed().subscribe(resultdialog => {
      let dialogRef2 = this.dialog.open(ProcessLoaderDialogComponent, {
        width: "250px",
        data: {}
      });

      this.foldertreeService
        .createFolder(node.id, resultdialog)
        .subscribe(result => {
          if (node.data.children) {
            node.data.children.push(result.data);
            foldertree.treeModel.update();
            this.ref.markForCheck();
            dialogRef2.close();
          } else {
            node.data.children = [];
            node.data.children.push(result.data);
            foldertree.treeModel.update();
            this.ref.markForCheck();
            dialogRef2.close();
          }
        });
    });
  }
}
