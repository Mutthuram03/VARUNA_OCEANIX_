import { getDocuments, createDocument, updateDocument, deleteDocument } from './firebase-services.js';
import { COLLECTIONS, ALERT_SEVERITY } from './firestore-schemas.js';

export const AlertService = {
  // Get all active alerts
  getActiveAlerts: async (filters = {}) => {
    try {
      const conditions = [
        { field: 'active', operator: '==', value: true }
      ];

      if (filters.severity) {
        conditions.push({ field: 'severity', operator: '==', value: filters.severity });
      }

      if (filters.region) {
        conditions.push({ field: 'region', operator: '==', value: filters.region });
      }

      const result = await getDocuments(COLLECTIONS.ALERTS, conditions);
      
      if (result.success) {
        return {
          success: true,
          alerts: result.data.map(alert => ({
            id: alert.id,
            title: alert.title,
            description: alert.message,
            severity: alert.severity,
            location: alert.location,
            active: alert.active,
            createdAt: alert.createdAt,
            expiresAt: alert.expiresAt,
            issuedBy: alert.issuedBy,
            actions: alert.actions || []
          }))
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new alert
  createAlert: async (alertData) => {
    try {
      const alertToSave = {
        title: alertData.title,
        message: alertData.description,
        severity: alertData.severity || ALERT_SEVERITY.MEDIUM,
        location: alertData.location,
        region: alertData.region,
        active: true,
        issuedBy: alertData.issuedBy || 'System',
        actions: alertData.actions || [],
        expiresAt: alertData.expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await createDocument(COLLECTIONS.ALERTS, alertToSave);
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: error.message };
    }
  },

  // Update alert status
  updateAlert: async (alertId, updates) => {
    try {
      return await updateDocument(COLLECTIONS.ALERTS, alertId, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      return { success: false, error: error.message };
    }
  },

  // Deactivate alert
  deactivateAlert: async (alertId) => {
    try {
      return await updateAlert(alertId, { active: false });
    } catch (error) {
      console.error('Error deactivating alert:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete alert
  deleteAlert: async (alertId) => {
    try {
      return await deleteDocument(COLLECTIONS.ALERTS, alertId);
    } catch (error) {
      console.error('Error deleting alert:', error);
      return { success: false, error: error.message };
    }
  }
};

