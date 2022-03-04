import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { TaskModel } from './task.model';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent implements OnInit {

  taskValue!:FormGroup

  taskObj:TaskModel = new TaskModel;

  taskList:any=[];

  btnSaveShow:boolean=true;
  btnUpdateShow:boolean=false;

  constructor(private formBuilder:FormBuilder, private api:ApiService) { }

  ngOnInit(): void {
    this.taskValue = this.formBuilder.group({
      tasktitle: [''],
      taskdesc: [''],
      status: ['']

    })
    this.getTask();
  }

  addTask() {
    this.taskObj.tasktitle = this.taskValue.value.tasktitle;
    this.taskObj.taskdesc = this.taskValue.value.taskdesc;
    this.taskObj.status = this.taskValue.value.status;
    this.api.postTask(this.taskObj).subscribe({next: (v) => {
      console.log(v)
    },
    error: (e) => {
      console.log(e)
      alert("Error")
    },
    complete: () => {
      console.log('Task created')
      alert("Task Added!")
      this.getTask();
      this.taskValue.reset();
    }})

  }
  getTask(){
    this.api.getTask().subscribe(res => {
      this.taskList = res;
    })
  }

  deleteTask(data:any){
    this.api.deleteTask(data.id).subscribe({next: (v) => {
      console.log(v)
    },
    error: (e) => {
      console.log(e)
      alert("Error")
    },
    complete: () => {
      console.log('Task deleted')
      alert("Task deleted!")
      this.getTask();
      
    }})
  }

  editTask(data:any) {
    this.taskValue.controls["tasktitle"].setValue(data.tasktitle);
    this.taskValue.controls["taskdesc"].setValue(data.taskdesc);
    this.taskValue.controls["status"].setValue(data.status);
    this.taskObj.id = data.id;
    this.showUpdate()
  }

  updateTask(){
    this.taskObj.tasktitle = this.taskValue.value.tasktitle;
    this.taskObj.taskdesc = this.taskValue.value.taskdesc;
    this.taskObj.status = this.taskValue.value.status;
    this.api.putTask(this.taskObj, this.taskObj.id).subscribe({next: (v) => {
      console.log(v)
    },
    error: (e) => {
      console.log(e)
      alert("Error")
    },
    complete: () => {
      console.log('Task Updated')
      alert("Task Updated!")
      this.getTask();
      this.taskValue.reset();
      this.showSave();
      this.taskObj.id = 0;
    }})

  }

  showSave(){
    this.btnSaveShow=true;
    this.btnUpdateShow=false;
  }

  showUpdate(){
    this.btnSaveShow=false;
    this.btnUpdateShow=true;
  }

}
