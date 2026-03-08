import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const safeText = (prop) => {
  if (!prop) return '';
  if (prop.type === 'title') return prop.title?.map((item) => item.plain_text).join('') || '';
  if (prop.type === 'rich_text') return prop.rich_text?.map((item) => item.plain_text).join('') || '';
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'multi_select') return prop.multi_select?.map((item) => item.name).join(', ') || '';
  if (prop.type === 'people') return prop.people?.map((person) => person.name).filter(Boolean).join(', ') || '';
  if (prop.type === 'created_by') return prop.created_by?.name || '';
  if (prop.type === 'url') return prop.url || '';
  return '';
};

const safeDate = (prop) => {
  if (!prop) return '';
  if (prop.type === 'date') return prop.date?.start || '';
  return '';
};

const pickPentester = (properties) => {
  const candidates = ['Found by', 'found by', 'found_by', 'pentester', 'researcher', 'owner', 'assigned_to'];
  for (const key of candidates) {
    if (properties[key]) {
      const value = safeText(properties[key]);
      if (value) return value;
    }
  }
  return 'Unassigned';
};

const pickProperty = (properties, names) => {
  for (const name of names) {
    if (properties[name]) return properties[name];
  }
  return null;
};

function toReadableError(error) {
  const backendMessage =
    error.response?.data?.message ||
    error.response?.data?.notion_error;
  if (backendMessage) {
    return backendMessage;
  }
  if (error.response?.status === 401) {
    return 'Notion auth failed (401). Check backend NOTION_API_KEY.';
  }
  if (error.response?.status === 404) {
    return 'Notion database not found (404). Check backend NOTION_DB_ID and integration access.';
  }
  if (error.response?.status === 403) {
    return 'Notion access forbidden (403). Share the database with your integration.';
  }
  if (error.response) {
    return `Notion proxy error (${error.response.status}).`;
  }
  return 'Network/proxy error while reaching backend API.';
}

export async function fetchVulnerabilities() {
  try {
    const response = await axios.post(`${API_URL}/api/notion`, {
      page_size: 100,
    });

    return (response.data?.results || [])
      .map((record) => {
        const properties = record.properties || {};
        const severityRaw = safeText(
          pickProperty(properties, ['Severity Level', 'severity level', 'Severity', 'severity'])
        ).toLowerCase();
        const vulnerabilityType =
          safeText(
            pickProperty(properties, [
              'Vulnerability type',
              'vulnerability type',
              'Vulnerability Type',
              'type',
              'Type',
            ])
          ) || 'General';

        return {
          id: record.id,
          title: safeText(pickProperty(properties, ['Name', 'name', 'title', 'Title'])) || 'Untitled Vulnerability',
          vulnerabilityType,
          severity: ['low', 'medium', 'high'].includes(severityRaw) ? severityRaw : 'low',
          date:
            safeDate(pickProperty(properties, ['Discovery date', 'discovery date', 'Discovery Date', 'date', 'Date'])) ||
            record.last_edited_time,
          pentester: pickPentester(properties),
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    throw new Error(toReadableError(error));
  }
}
