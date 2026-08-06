using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;

namespace desktop
{
    public static class ApiClient
    {
        private static readonly HttpClient client = new HttpClient
        {
            BaseAddress = new Uri("http://localhost/stajERP/backend/")
        };

        public static async Task<T?> GetAsync<T>(string endpoint)
        {
            try
            {
                HttpResponseMessage response = await client.GetAsync(endpoint);
                if (response.IsSuccessStatusCode)
                {
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<T>(json);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sunucu Bağlantı Hatası: " + ex.Message, "Bağlantı Hatası", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            return default;
        }

        public static async Task<TResponse?> PostAsync<TRequest, TResponse>(string endpoint, TRequest data)
        {
            try
            {
                string jsonInput = JsonConvert.SerializeObject(data);
                var content = new StringContent(jsonInput, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(endpoint, content);
                if (response.IsSuccessStatusCode)
                {
                    string jsonOutput = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<TResponse>(jsonOutput);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sunucu Bağlantı Hatası: " + ex.Message, "Bağlantı Hatası", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            return default;
        }
    }
}