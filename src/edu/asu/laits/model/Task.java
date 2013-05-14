/**
 * LAITS Project
 * Arizona State University
 * (c) 2013, Arizona Board of Regents for and on behalf of Arizona State University.
 * This file is part of LAITS.
 *
 * LAITS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * LAITS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with LAITS.  If not, see <http://www.gnu.org/licenses/>.
 */

package edu.asu.laits.model;

/**
 *
 * @author ramayantiwari
 */
public class Task {
    private String taskName;
    private String taskDescription;
    private String imageURL;
    private int startTime, endTime;
    private String units;
    
    public Task(){
        taskName = "";
        taskDescription = "";
        imageURL = "";
        startTime = 0;
        endTime = 10;
        units = "Days";
    }
    
    public Task(int s, int e, String u){
        this.startTime = s;
        this.endTime = e;
        this.units = u;
    }
    
    public int getStartTime(){
        return startTime;
    }
    
    public void setStartTime(int s){
        startTime = s;
    }
    
    public int getEndTime(){
        return endTime;
    }
    
    public void setEndTime(int s){
        endTime = s;
    }
    
    public String getUnits(){
        return units;
    }   
    
    public void setUnits(String inputUnits){
        units = inputUnits;
    }
    
    public String getTaskName(){
        return taskName;
    }
    
    public void setTaskName(String inputName){
        taskName = inputName;
    }
    
    public String getTaskDescription(){
        return taskDescription;
    }
    
    public void setTaskDescription(String inputDesc){
        taskDescription = inputDesc;
    }
    
    public String getImageURL(){
        return imageURL;
    }
    
    public void setImageURL(String input){
        imageURL = input;
    }    
    
}
