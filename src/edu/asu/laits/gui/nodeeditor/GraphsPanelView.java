/*
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
 * @author: rptiwari
 */
package edu.asu.laits.gui.nodeeditor;

import edu.asu.laits.editor.ApplicationContext;
import edu.asu.laits.model.Graph;
import edu.asu.laits.model.Task;
import edu.asu.laits.model.Vertex;
import java.awt.*;
import javax.swing.JPanel;
import org.apache.log4j.Logger;

/**
 *
 * @author Lishan
 */
public class GraphsPanelView extends javax.swing.JPanel {

    JPanel grafica;
    //the width and height of the panel
    int width, height;
    private NodeEditor nodeEditor;
    
    /**
     * Logger *
     */
    private static Logger logs = Logger.getLogger("DevLogs");
    private static Logger activityLogs = Logger.getLogger("ActivityLogs");

    public GraphsPanelView(NodeEditor ne) {
        initComponents();
        nodeEditor = ne;

    }

    public void loadGraph(){
        
        if(ApplicationContext.getAppMode().equals("STUDENT")){
            Task t = new Task(ApplicationContext.getCorrectSolution().getStartTime(), 
                    ApplicationContext.getCorrectSolution().getEndTime(), 
                    ApplicationContext.getCorrectSolution().getGraphUnits());
            loadStudentGraph(t);
            
            loadCorrectGraph(ApplicationContext.getCorrectSolution()
                    .getSolutionGraph().getVertexByName(nodeEditor.getCurrentVertex().getName())
                    , t);
        }else{
            correctAnswerPanel.setVisible(false);
            correctGraphLabel.setVisible(false);
            studentGraphLabel.setText("Author's Graph");
            
            Task task = nodeEditor.getGraphPane().getModelGraph().getCurrentTask();
            loadStudentGraph(task);
        }
    }
    
    public void loadCorrectGraph(Vertex v, Task task) {
        correctAnswerPanel.removeAll();
        
        Dimension d = new Dimension(575, 190);
        PlotPanel plotPanel = new PlotPanel(v, task.getStartTime(), task.getEndTime(), task.getUnits(), d);
        this.correctAnswerPanel.setLayout(new java.awt.GridLayout(1, 1));
        this.correctAnswerPanel.add(plotPanel);
    }
    
    public void loadStudentGraph(Task task) {
        studentAnswerPanel.removeAll();
        
        Vertex currentVertex = nodeEditor.getCurrentVertex();
        updateDescription();
        
        Dimension d = new Dimension(575, 190);

        PlotPanel plotPanel = new PlotPanel(currentVertex, task.getStartTime(), task.getEndTime(), task.getUnits(), d);
        this.studentAnswerPanel.setLayout(new java.awt.GridLayout(1, 1));
        this.studentAnswerPanel.add(plotPanel);
    }

    /**
     * This method is used when the user selects a name and description for the
     * node currently being edited
     */
    public void updateDescription() {
        descriptionLabel.setText("<html><b>Description:</b> <br/>" +nodeEditor.getCurrentVertex().getCorrectDescription()+ "</html>");
    }
    
    public boolean isViewEnabled(){
        if (!nodeEditor.getCurrentVertex().getGraphsStatus().equals(Vertex.GraphsStatus.UNDEFINED)) 
            return true;
        
        return false;
    }
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        nodeDescriptionLabel = new javax.swing.JLabel();
        allGraphsPanel = new javax.swing.JPanel();
        studentGraphLabel = new javax.swing.JLabel();
        studentAnswerPanel = new javax.swing.JPanel();
        correctGraphLabel1 = new javax.swing.JLabel();
        correctGraphLabel2 = new javax.swing.JLabel();
        correctAnswerPanel = new javax.swing.JPanel();
        correctGraphLabel = new javax.swing.JLabel();
        descriptionLabel = new javax.swing.JLabel();

        setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        nodeDescriptionLabel.setText("<html></html>");
        add(nodeDescriptionLabel, new org.netbeans.lib.awtextra.AbsoluteConstraints(746, 101, -1, -1));

        allGraphsPanel.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        studentGraphLabel.setFont(new java.awt.Font("Lucida Grande", 1, 13)); // NOI18N
        studentGraphLabel.setText("Student's Graph:");
        allGraphsPanel.add(studentGraphLabel, new org.netbeans.lib.awtextra.AbsoluteConstraints(6, 6, -1, -1));

        studentAnswerPanel.setMaximumSize(new java.awt.Dimension(575, 300));
        studentAnswerPanel.setPreferredSize(new java.awt.Dimension(575, 300));

        javax.swing.GroupLayout studentAnswerPanelLayout = new javax.swing.GroupLayout(studentAnswerPanel);
        studentAnswerPanel.setLayout(studentAnswerPanelLayout);
        studentAnswerPanelLayout.setHorizontalGroup(
            studentAnswerPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 575, Short.MAX_VALUE)
        );
        studentAnswerPanelLayout.setVerticalGroup(
            studentAnswerPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 190, Short.MAX_VALUE)
        );

        allGraphsPanel.add(studentAnswerPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 30, 575, 190));

        correctGraphLabel1.setText("     ");
        allGraphsPanel.add(correctGraphLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(6, 391, -1, -1));

        correctGraphLabel2.setText("                   ");
        allGraphsPanel.add(correctGraphLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(6, 369, -1, -1));

        correctAnswerPanel.setMaximumSize(new java.awt.Dimension(575, 300));
        correctAnswerPanel.setPreferredSize(new java.awt.Dimension(575, 300));

        javax.swing.GroupLayout correctAnswerPanelLayout = new javax.swing.GroupLayout(correctAnswerPanel);
        correctAnswerPanel.setLayout(correctAnswerPanelLayout);
        correctAnswerPanelLayout.setHorizontalGroup(
            correctAnswerPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 575, Short.MAX_VALUE)
        );
        correctAnswerPanelLayout.setVerticalGroup(
            correctAnswerPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 190, Short.MAX_VALUE)
        );

        allGraphsPanel.add(correctAnswerPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 270, 575, 190));

        correctGraphLabel.setFont(new java.awt.Font("Lucida Grande", 1, 13)); // NOI18N
        correctGraphLabel.setText("Correct's Graph:");
        allGraphsPanel.add(correctGraphLabel, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 240, -1, -1));

        add(allGraphsPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 60, -1, 460));

        descriptionLabel.setText("<html><b>Description:</b></html>");
        descriptionLabel.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        add(descriptionLabel, new org.netbeans.lib.awtextra.AbsoluteConstraints(6, 20, 560, 50));
    }// </editor-fold>//GEN-END:initComponents
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel allGraphsPanel;
    private javax.swing.JPanel correctAnswerPanel;
    private javax.swing.JLabel correctGraphLabel;
    private javax.swing.JLabel correctGraphLabel1;
    private javax.swing.JLabel correctGraphLabel2;
    private javax.swing.JLabel descriptionLabel;
    private javax.swing.JLabel nodeDescriptionLabel;
    private javax.swing.JPanel studentAnswerPanel;
    private javax.swing.JLabel studentGraphLabel;
    // End of variables declaration//GEN-END:variables
}
