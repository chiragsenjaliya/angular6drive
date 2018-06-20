import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TREE_ACTIONS,TreeNode } from "angular-tree-component";
import { Router } from "@angular/router";
import { FoldertreeService } from '../../services/foldertree.service';
import { MatDialog } from "@angular/material";
import { AlertService } from "../../../shared/services/alert.service";
import { CreateFolderDialogComponent } from "../../dialog/create-folder-dialog/create-folder-dialog.component";
import { ProcessLoaderDialogComponent } from "../../dialog/process-loader-dialog/process-loader-dialog.component";
@Component({
  selector: "app-drivetree",
  templateUrl: "./drivetree.component.html",
  styleUrls: ["./drivetree.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrivetreeComponent implements OnInit {
  @ViewChild("foldertree") folderTree;
  nodes:any;

  options = {
    useVirtualScroll: false,
  };
  constructor(
    private foldertreeService: FoldertreeService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.foldertreeService.activeNode.subscribe(
      data => {
        return this.foldertreeService
          .foldrertree(data)
          .then(result => {
            if(result.data){
              this.nodes = [
                {
                  name: "/",
                  hasChildren: true,
                  isExpanded:true,
                  id: "0",
                  children: result.data
                }
              ];             
              
            }else{
              this.nodes = [{ name: "/", hasChildren: false, id: "0",isActive:true}];
              
            }
            this.folderTree.treeModel.update();
            this.ref.detectChanges();  
            this.folderTree.treeModel.doForAll(treeNode => {
              if (treeNode.data.isActive === true) {
                treeNode.toggleActivated();
              }
              if (treeNode.data.isFocused === true) {
                this.folderTree.treeModel.setFocus(treeNode);
              }
            });            
          })
          .catch(error => {
            console.log(error);
            return [];
          });
        
      },
      error => console.log(error)
    );
  }

  contextMenuOpen($event, menutrigger) {
    $event.preventDefault();
    $event.stopPropagation();
    menutrigger.openMenu();
  }

  navigate($event, node) {
    if (node.id == 0) {
      node.id = "";
    }
    $event.preventDefault();
    this.router.navigate(["/drive/folder", node.id]);
  }

  isExpand($event, isexpand) {
    $event.preventDefault();
    isexpand ? TREE_ACTIONS.COLLAPSE : TREE_ACTIONS.EXPAND;
  }

  createFolder(node, foldertree) {
    let dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: "250px",
      data: { name: "" },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(resultdialog => {
      console.log(resultdialog);
      
      if (resultdialog) {
        let dialogRef2 = this.dialog.open(ProcessLoaderDialogComponent, {
          width: "250px",
          data: {},
          disableClose: false
        });

        this.foldertreeService
          .createFolder(node.id, resultdialog)
          .subscribe(result => {
            if (node.data.children) {
              node.data.children.push(result.data);
              foldertree.treeModel.update();
              this.ref.markForCheck();
              dialogRef2.close();
              this.foldertreeService.activeNode.next(node.id);
              this.foldertreeService.isFolderCreated.next(true);
            } else {
              node.data.children = [];
              node.data.children.push(result.data);
              foldertree.treeModel.update();
              this.ref.markForCheck();
              dialogRef2.close();
              this.foldertreeService.activeNode.next(node.id);
              this.foldertreeService.isFolderCreated.next(true);
            }
          });
      }
    });
  }
}
