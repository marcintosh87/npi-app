class CreateProviders < ActiveRecord::Migration[6.1]
  def change
    create_table :providers do |t|
      t.integer :npi
      t.string :name
      t.string :adress
      t.string :type
      t.string :taxonomy

      t.timestamps
    end
  end
end
